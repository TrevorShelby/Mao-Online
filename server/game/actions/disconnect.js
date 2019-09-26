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
				//TODO: Add case for if someone in an accusation leaves.
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