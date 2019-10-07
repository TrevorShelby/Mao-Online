const { seatColors } = require('./config.js')


const tableReducers = {
	joinedTable: (table, {you, others}) => ({...table,
		me: you,
		playerIDs: others.concat(you),
		mode: 'lobby',
		chatLog: [],
		rules: []
	}),
	playerJoined: (table, playerID) => ({...table,
		playerIDs: table.playerIDs.concat(playerID)
	}),
	playerLeft: (table, disconnectorID) => ({...table,
		playerIDs: table.playerIDs.filter( playerID => playerID != disconnectorID )
	}),
	playerTalked: (table, chat) => ({...table,
		chatLog: table.chatLog.concat(chat)
	}),
	roundStarted: (table, {discard, yourHand: myHand}) => ({...table,
		mode: 'round',
		round: {
			mode: 'play',
			discard,
			handLengths: createHandLengths(table.playerIDs),
			myHand,
			timeOfLastCardMove: -1
		}
	}),
	roundOver: (table, winningPlayer) => ({...without(table, 'round'),
		mode: 'inBetweenRounds',
		lastWinner: winningPlayer
	}),
	cardMoved: (table, {card, from, to, by, at}) => ({...table,
		round: moveCard(table.round, table.me, {card, from, to, by, at})
	}),
	playerAccused: (table, {accuser, accused}) => ({...table,
		round: {...table.round,
			mode: 'accusation'
		},
		accusation: {accuser, accused}
	}),
	accusationAccepted: (table, data) => {
		if(table.accusation.accused == table.me) return penalize(table, data)
		
		else return {...without(table, 'accusation'),
			round: {...table.round,
				mode: 'play',
				handLengths: {...table.round.handLengths, [table.accusation.accused]: data}
			}
		}
	},
	accusationCancelled: (table, mode) => ({...without(table, 'accusation'),
		round: {...table.round,
			mode
		}
	}),
	ruleWritten: (table, rule) => ({...table,
		rules: table.rules.concat(rule)
	})
}



//Thank you for the thunk, Freesound user Anthousai!
//source: https://freesound.org/s/406493/
const thunk = new Audio('resources/thunk.wav')
thunk.load()
//'1cards.wav' by Freesound user bigmac4029 (https://freesound.org/people/bigmac4029/)
//attribution: https://freesound.org/s/120508/
//license: CC BY 3.0 https://creativecommons.org/licenses/by/3.0/legalcode
const cld = new Audio('resources/cld.wav')
cld.load()
//'Dealing Card' by Freesound user f4ngy (https://freesound.org/people/f4ngy)
//attribution: https://freesound.org/s/240777/
//license: CC BY 3.0 https://creativecommons.org/licenses/by/3.0/legalcode
//I cut out some silence at the beginning and end of the original sound.
const flk = new Audio('resources/flk.wav')
flk.load()
function rootReducer(state={}, action) {
	if(action.type == 'playerAccused') thunk.play()
	if(action.type == 'cardMoved') {
		if(action.data.from.source == 'hand' || action.data.from.source == 'discard') cld.play()
		if(action.data.from.source == 'deck') flk.play()
	}

	const table = (()=> {
		if(action.type in tableReducers) return tableReducers[action.type](state.table, action.data)
		else return state.table
	})()
	//TODO: Consider moving this into GameLog component's state
	const gameMessages = (() => {
		if(action.type == 'joinedTable')
			return []
		else if(action.type == 'playerTalked')
			return state.gameMessages.concat({type: 'chat', chatData: action.data})
		else if(action.type == 'playerJoined')
			return state.gameMessages.concat({type: 'playerJoined', joinerID: action.data})
		else if(action.type == 'playerLeft')
			return state.gameMessages.concat({type: 'playerLeft', disconnectorID: action.data})
		else if(action.type == 'cardMoved') {
			const {from, to, card, by} = action.data
			const cardWasPlayed = from.source == 'hand' && to.source == 'discard'
			if(cardWasPlayed)
				return state.gameMessages.concat({
					type: 'cardMoved', moveType: 'play',
					cardIsNowTopCard: to.cardIndex == state.table.round.discard.length,
					card, cardIndex: to.cardIndex, by
				})
			if(from.source == 'deck' && to.source == 'hand')
				return state.gameMessages.concat({type: 'cardMoved', moveType: 'draw', by})
			if(from.source == 'discard' && to.source == 'hand')
				return state.gameMessages.concat({
					type:'cardMoved', moveType: 'take', card, by
				})
			//TODO: Remove later.
			else
				return state.gameMessages
		}
		else
			return state.gameMessages
	})()
	const playerColors = (() => {
		if(action.type == 'roundStarted' && state.table.mode == 'lobby')
			return state.table.playerIDs.reduce( (playerColors, playerID, index) => {
				playerColors[playerID] = seatColors[index]
				return playerColors
			}, {})
		else
			return state.playerColors
	})()
	const selectedCardIndex = (() => {
		if(action.type == 'cardSelected') return action.selectedCardIndex
		else return state.selectedCardIndex
	})()
	const visibleDiscardCardIndex = (() => {
		const data = action.data
		const discard = state.table && state.table.round && state.table.round.discard
		const visCardIndex = state.visibleDiscardCardIndex
		if(action.type == 'roundStarted')
			return 0
		if(isPlayingOnDiscard(action) && data.to.cardIndex <= visCardIndex + 1)
			return visCardIndex + 1
		if(action.type == 'nextDiscardCard')
			return visCardIndex < discard.length - 1 ? visCardIndex + 1 : visCardIndex
		if(action.type == 'previousDiscardCard' || supportingCardWasTaken(action, visCardIndex))
			return visCardIndex > 0 ? visCardIndex - 1 : visCardIndex
		if(action.type == 'setDiscardCardIndex')
			return action.cardIndex
		else
			return visCardIndex
	})()
	const tableConn = (() => {
		if(action.type == 'connectionMade') return action.tableConn
		else return state.tableConn
	})()
	return { table, gameMessages, playerColors, selectedCardIndex, visibleDiscardCardIndex, tableConn }
}



const isPlayingOnDiscard = action => action.type == 'cardMoved' && action.data.to.source == 'discard'

const supportingCardWasTaken = (action, visCardIndex) => (
	action.type == 'cardMoved' && action.data.from.source == 'discard'
	&& action.data.from.cardIndex <= visCardIndex
)

const penalize = (table, penaltyCard) => (
	{...without(table, 'accusation'),
		round: {...table.round,
			mode: 'play',
			myHand: table.round.myHand.concat(penaltyCard)
		}
	}
)


const createHandLengths = playerIDs => (
	playerIDs.reduce(
		( (handLengths, playerID) => ({...handLengths, [playerID]: 7}) ),
		{}
	)
)


function without(obj, prop) {
	const { [prop]:x, ...newObj } = obj
	return newObj
}


function moveCard(round, me, {card, from, to, by, at}) {
	const myHand = round.myHand.slice() //copies array
	const handLengths = {...round.handLengths}
	const discard = round.discard.slice()

	const movedByMe = me == by
	if(movedByMe && from.source == 'hand') myHand.splice(from.cardIndex, 1)
	if(movedByMe && to.source == 'hand') myHand.push(card)

	if(!movedByMe && from.source == 'hand') handLengths[by] = from.length
	else if(!movedByMe && to.source == 'hand') handLengths[by] = to.length

	if(from.source == 'discard') discard.splice(from.cardIndex, 1)
	if(to.source == 'discard') {
		//TODO: Consider removing playedBy field
		const markedCard = {rank: card.rank, suit: card.suit, playedBy: by}
		discard.splice(to.cardIndex, 0, markedCard)
	}

	return {...round,
		myHand, handLengths, discard,
		timeOfLastCardMove: at
	}
}



module.exports = rootReducer