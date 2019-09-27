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
			myHand
		}
	}),
	roundOver: (table, winningPlayer) => ({...without(table, 'round'),
		mode: 'inBetweenRounds',
		lastWinner: winningPlayer
	}),
	cardMoved: (table, {card, from, to, by}) => ({...table,
		round: moveCard(table.round, table.me, {card, from, to, by})
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
		},
		a: console.log(mode)
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
		if(action.data.from.source == 'hand') cld.play()
		if(action.data.from.source == 'deck') flk.play()
	}

	const table = (()=> {
		if(action.type in tableReducers) return tableReducers[action.type](state.table, action.data)
		else return state.table
	})()
	const gameMessages = (() => {
		if(action.type == 'joinedTable')
			return []
		else if(action.type == 'playerTalked')
			return state.gameMessages.concat({type: 'chat', chatData: action.data})
		else if(action.type == 'playerJoined')
			return state.gameMessages.concat({type: 'playerJoined', joinerID: action.data})
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
		if(isPlayingOnDiscard(action) && shouldVisCardIndexBumpUp(data, discard, visCardIndex))
			return visCardIndex + 1
		if(action.type == 'nextDiscardCard')
			return visCardIndex < discard.length - 1 ? visCardIndex + 1 : visCardIndex
		if(action.type == 'previousDiscardCard')
			return visCardIndex > 0 ? visCardIndex - 1 : visCardIndex
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

const shouldVisCardIndexBumpUp = (data, discard, visCardIndex) => {
	if(visCardIndex == discard.length - 1)
		//is visible card representing top card and has top card has changed, thus bumping it up
		return data.to.cardIndex == visCardIndex + 1
	else
		//has a card been inserted below visible card's index, thus bumping it up
		return data.to.cardIndex < visCardIndex
}

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


function moveCard(round, me, {card, from, to, by}) {
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
		const markedCard = {rank: card.rank, suit: card.suit, playedBy: by}
		discard.splice(to.cardIndex, 0, markedCard)
	}

	return {...round,
		myHand, handLengths, discard
	}
}



module.exports = rootReducer