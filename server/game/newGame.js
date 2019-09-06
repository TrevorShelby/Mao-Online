const startNewRound = require('./newRound.js')



function startNewGame(table) {
	table.playerIDs = table.connections.map( ([playerID]) => playerID)
	table.numRoundsPlayed = 0
	table.rules = {
		starters: [
			'When a spades card is played, the person who played it has to say the card\'s suit and'
				+ ' rank.',
			'When an ace card is played, the order of player reverses.',
			'When a jack card is played, a player can name the next suit that has to be played.'
		],
		playerMade: []
	}

	startNewRound(table)
}



module.exports = startNewGame