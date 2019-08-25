const getNewRound = require('../newRound.js')
const sendRoundStartedEvent = require('../sendRoundStartedEvent.js')



function disconnect_(table, eventHistories, sendEvent, disconnectingID) {
	function disconnect() {
		table.playerConnections.delete(disconnectingID)
		eventHistories.delete(disconnectingID)

		sendEvent(Array.from(table.playerConnections.keys()), 'playerLeft', disconnectingID)

		if(table.mode == 'game') {
			delete table.game.playerIDs[table.game.playerIDs.indexOf(disconnectingID)]
			if(table.game.inBetweenRounds && table.game.lastWinner == disconnectingID) {
				table.game.round = getNewRound(table.game.playerIDs)
				table.game.inBetweenRounds = false
				sendRoundStartedEvent(table.game.round, sendEvent)
			}
			else if(!table.game.inBetweenRounds) {
				const disconnectingSeat = table.game.round.seating.indexOf(disconnectingID)
				delete table.game.round.seating[disconnectingSeat]
				sendEvent(table.game.round.seating, 'seatEmptied', disconnectingSeat)
				delete table.game.round.hands[disconnectingSeat]

				//TODO: When pile adding and deleting are introduced, add event that corresponds.
				table.game.round.piles.forEach( (pile, pileIndex) => {
					if(pile.owner == disconnectingSeat) {
						delete table.game.round.piles[pileIndex]
					}
				})
			}
			const disconnectorRules = table.game.rules.playerRules.map( (playerRule) => {
				if(playerRule.author == disconnectingID) {
					return playerRule.rule
				}
			})
			if(disconnectorRules.length > 0) {
				sendEvent(table.game.round.seating, 'rulesRevealed', {
					author: disconnectingID, rules: disconnectorRules
				})
			}
		}
		//TODO: replace later
		if(table.playerConnections.size == 0) { throw new Error('No more players.') }
	}
	return disconnect
}



module.exports = disconnect_