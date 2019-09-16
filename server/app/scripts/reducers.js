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
			piles: [{owner: undefined, cards: discard}],
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
		if(action.data.from.source == 'hand') cld.play()
		if(action.data.from.source == 'deck') flk.play()
	}

	if(action.type == 'roundStarted' && state.table.mode == 'lobby') {
		return({...state,
			table: tableReducers[action.type](state.table, action.data),
			playerColors: state.table.playerIDs.reduce( (playerColors, playerID, index) => {
				playerColors[playerID] = seatColors[index]
				return playerColors
			}, {})
		})
	}
	if(action.type in tableReducers) {
		return ({...state,
			table: tableReducers[action.type](state.table, action.data)
		})
	}
	else if(action.type == 'cardSelected') {
		return ({...state,
			selectedCardIndex: action.selectedCardIndex
		})
	}
	else if(action.type == 'connectionMade') {
		return ({...state,
			tableConn: action.tableConn
		})
	}
	return state
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
	const piles = round.piles.map( (pile) => ({
		owner: pile.owner,
		cards: pile.cards.slice()
	}))

	const movedByMe = me == by
	if(movedByMe && from.source == 'hand') myHand.splice(from.cardIndex, 1)
	if(movedByMe && to.source == 'hand') myHand.push(card)

	if(!movedByMe && from.source == 'hand') handLengths[by] = from.length
	else if(!movedByMe && to.source == 'hand') handLengths[by] = to.length

	if(from.source == 'pile') piles[from.pileIndex].cards.splice(from.cardIndex, 1)
	if(to.source == 'pile') {
		const markedCard = {rank: card.rank, suit: card.suit, playedBy: by}
		piles[to.pileIndex].cards.splice(to.cardIndex, 0, markedCard)
	}

	return {...round,
		myHand, handLengths, piles
	}
}



module.exports = rootReducer