const startNewRound = require('../newRound.js')



function disconnect_(table, eventHistories, disconnectorID) {
	function disconnect() {
		const connectionIndex = table.playerIDs.indexOf(disconnectorID)
		table.connections.splice(connectionIndex, 1)
		table.playerIDs.splice(connectionIndex, 1)
		delete eventHistories[disconnectorID]

		table.sendEvent(table.playerIDs, 'playerLeft', disconnectorID)
		if(table.mode == 'round' || table.mode == 'inBetweenRounds') {
			//gets rid of empty elements
			const numPlayersAtTable = table.playerIDs.filter(Boolean).length
			if(numPlayersAtTable == 1 && table.options.roundLimit > table.numRoundsPlayed) {
				table.sendEvent(table.playerIDs, 'gameEnded')
				table.connections.forEach( ([_,conn]) => conn.close() )
			}
			else if(numPlayersAtTable == 0) {
				delete table.game; delete table.round; delete table.accusation;
				delete table.lastWinner; delete table.numRoundsPlayed; delete table.rules
				table.mode = 'lobby'
				table.chatLog = []
				return
			}
			if(table.mode == 'inBetweenRounds' && table.lastWinner == disconnectorID) {
				startNewRound(table)
			}
			else if(table.mode == 'round') {
				delete table.round.hands[disconnectorID]

				//TODO: When pile adding and deleting are introduced, add event that corresponds.
				// table.round.piles.forEach( (pile, pileIndex) => {
				// 	if(pile.owner == disconnectorID) table.round.piles.splice(pileIndex, 1)
				// })

				if(
					table.round.mode == 'lastChance'
					&& table.round.winningPlayer == disconnectorID
				) {
					table.round.mode = 'play'
					table.round.winningPlayer = undefined
					table.sendEvent(table.playerIDs, 'winningPlayerLeft')
				}

				//if an accuser or accused leaves during an accusation, drop that accusation.
				if(
					table.round.mode == 'accusation'
					&& (
						disconnectorID == table.accusation.accuser
						|| disconnectorID == table.accusation.accused
					)
				) {
					//copy-pasted from endAccusation.js
					const previousMode = table.accusation.previousMode
					if(previousMode == 'play') {
						table.round.mode = 'play'
						table.sendEvent(table.playerIDs, 'accusationCancelled', 'play')
					}
					else if(
						previousMode == 'lastChance'
						&& table.accusation.accused == table.round.winningPlayer
					) {
						if(disconnectorID == table.accusation.accused) {
							table.round.mode = 'play'
							table.round.winningPlayer = undefined
							table.sendEvent(table.playerIDs, 'accusationCancelled', 'play')
						}
						else if(disconnectorID == table.accusation.accuser) {
							table.round.mode = 'lastChance'
							table.sendEvent(table.playerIDs, 'accusationCancelled', 'lastChance')
						}
					}
					delete table.accusation
				}
			}

			const disconnectorsRules = table.rules.playerMade.filter(
				playerRule => playerRule.author == disconnectorID
			).map( playerRule => playerRule.rule )
			if(disconnectorsRules.length > 0) {
				table.sendEvent(table.playerIDs, 'rulesRevealed', {
					author: disconnectorID, rules: disconnectorsRules
				})
			}
		}
	}
	return disconnect
}



module.exports = disconnect_