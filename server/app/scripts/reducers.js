const tableReducers = {
	joinedTable: (table, {you, others}) => (
		{...table,
			me: you,
			playerIDs: others.concat(you),
			mode: 'lobby',
			chatLog: []
		}
	),
	playerJoined: (table, playerID) => (
		{...table,
			playerIDs: table.playerIDs.concat(playerID)
		}
	),
	playerLeft: (table, disconnectorID) => (
		{...table,
			playerIDs: table.playerIDs.filter( playerID => playerID != disconnectorID )
		}
	),
	playerTalked: (table, chat) => (
		{...table,
			chatLog: table.chatLog.concat(chat)
		}
	),
	roundStarted: (table, {discard, yourHand: myHand}) => (
		{...table,
			mode: 'round',
			round: {
				mode: 'play',
				piles: [{owner: undefined, cards: discard}],
				handLengths: createHandLengths(table.playerIDs),
				myHand
			}
		}
	),
	roundOver: (table, winningPlayer) => (
		{...without(table, 'round'),
			mode: 'inBetweenRounds',
			lastWinner: winningPlayer
		}
	),
	cardMoved: (table, {card, from, to, by}) => (
		{...table,
			round: moveCard(table.round, table.me, {card, from, to, by})
		}
	),
	playerAccused: (table, {accuser, accused}) => (
		{...table,
			round: {...table.round,
				mode: 'accusation'
			},
			accusation: {accuser, accused}
		}
	),
	accusationAccepted: (table) => (
		{...without(table, 'accusation'),
			round: {...table.round,
				mode: 'play'
			}
		}
	),
	accusationCancelled: (table, mode) => (
		{...without(table, 'accusation'),
			round: {...table.round,
				mode
			}
		}
	)
}



const createHandLengths = playerIDs => (
	playerIDs.reduce(
		( (handLengths, playerID) => ({...handLengths, [playerID]: 7}) ),
		{}
	)
)



function rootReducer(state={}, action) {
	if(action.type in tableReducers) {
		return ({...state,
			table: tableReducers[action.type](state.table, action.data)
		})
	}
	else if(action.type == 'selectCard') {
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
	if(to.source == 'pile') piles[to.pileIndex].cards.splice(to.cardIndex, 0, card)

	return {...round,
		myHand, handLengths, piles
	}
}



module.exports = rootReducer