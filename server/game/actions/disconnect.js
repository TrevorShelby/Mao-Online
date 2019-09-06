const startNewRound = require('../newRound.js')
const sendRoundStartedEvent = require('../sendRoundStartedEvent.js')



function disconnect_(table, eventHistories, disconnectingID) {
	function disconnect() {
		const connectionIndex = table.playerIDs.indexOf(disconnectingID)
		delete table.connections[connectionIndex]
		delete table.playerIDs[connectionIndex]
		delete eventHistories[disconnectingID]

		sendEvent(table.playerIDs, 'playerLeft', disconnectingID)

		if(table.mode == 'round' || table.mode == 'inBetweenRounds') {
			//gets rid of empty elements
			const numPlayers = table.playerIDs.filter(Boolean).length
		}

		if(table.mode == 'game') {
			delete table.game.playerIDs[table.game.playerIDs.indexOf(disconnectingID)]
			const nonEmptyPlayerIDs = table.game.playerIDs.filter(Boolean)
			if(
				nonEmptyPlayerIDs.length == 1
				&& table.options.roundLimit > table.game.numRoundsPlayed
			) {
				sendEvent(table.game.playerIDs, 'gameEnded')
				table.playerConnections.forEach( (conn) => {conn.close()})
			}
			else if(nonEmptyPlayerIDs.length == 0) {
				table.game = undefined
				table.chatLog = []
				table.mode = 'lobby'
				return
			}
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

				if(
					table.game.round.mode == 'lastChance' 
					&& table.game.round.winningSeat == disconnectingSeat
				) {
					table.game.round.mode = 'play'
					table.game.round.accusation = undefined
					table.game.round.winningSeat = undefined
					sendEvent(table.game.round.seating, 'winningSeatEmptied')
				}
				//TODO: Add case for if someone in an accusation leaves.
			}
			const disconnectorRules = table.game.rules.playerRules.filter( (playerRule) => {
				if(playerRule.author == disconnectingID) {
					return true
				}
			}).map( (playerRule) => { return playerRule.rule } )
			if(disconnectorRules.length > 0) {
				sendEvent(table.game.round.seating, 'rulesRevealed', {
					author: disconnectingID, rules: disconnectorRules
				})
			}
		}
	}
	return disconnect
}



module.exports = disconnect_