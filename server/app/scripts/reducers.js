const endAccusation = (table, mode) => (
	{...table,
		game: {...table.game,
			round: {...table.game.round,
				accusation: undefined,
				mode
			}
		}
	}
)

const tableReducers = {
	joinedTable: (table, {you, others}) => (
		{...table,
			me: you,
			playerIDs: others.concat(you),
			chatLog: []
		}
	),
	playerJoined: (table, playerID) => (
		{...table,
			playerIDs: table.playerIDs.concat(playerID)
		}
	),
	playerLeft: (table, playerID) => (
		{...table,
			playerIDs: replace(table.playerIDs, playerID, undefined)
		}
	),
	playerTalked: (table, chat) => (
		{...table,
			chatLog: table.chatLog.concat(chat)
		}
	),
	gameStarted: (table) => (
		{...table,
			game: {
				myRules: []
			}
		}
	),
	roundStarted: (table, {discard, you: {hand, seat}}) => (
		{...table,
			game: {...table.game,
				round: {
					mode: 'play',
					piles: [{owner: undefined, cards: discard}],
					handLengths: table.playerIDs.map( () => 7 ),
					me: { hand, seat }
				}
			}
		}
	),
	cardMoved: (table, {card, from, to, by}) => (
		{...table,
			game: {...table.game,
				round: moveCard(table.game.round, {card, from, to, by})
			}
		}
	),
	playerAccused: (table, {accuser, accused}) => (
		{...table,
			game: {...table.game,
				round: {...table.game.round,
					accusation: {accuser, accused},
					mode: 'accusation'
				}
			}
		}
	),
	accusationCancelled: endAccusation,
	accusationAccepted: endAccusation
}



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



function replace(arr, elementToReplace, replacement) {
	return arr.map( element => {
		if(element == elementToReplace) { return replacement }
		else { return element }
	})
}


function moveCard(round, {card, from, to, by}) {
	const myHand = round.me.hand.slice() //copies array
	const handLengths = round.handLengths.slice()
	const piles = round.piles.map( (pile) => ({
		owner: pile.owner,
		cards: pile.cards.slice()
	}))

	const movedByMe = round.me.seat == by
	if(movedByMe && from.source == 'hand') {
		myHand.splice(from.cardIndex, 1)
	}
	if(movedByMe && to.source == 'hand') {
		myHand.push(card)
	}

	if(!movedByMe && from.source == 'hand') {
		handLengths[by] = from.length
	} 
	else if(!movedByMe && to.source == 'hand') {
		handLengths[by] = to.length
	}

	if(from.source == 'pile') {
		piles[from.pileIndex].cards.splice(to.cardIndex, 1)
	}
	if(to.source == 'pile') {
		piles[to.pileIndex].cards.splice(to.cardIndex, 0, card)
	}

	return {...round,
		me: {...round.me, hand: myHand},
		handLengths, piles
	}
}



module.exports = rootReducer