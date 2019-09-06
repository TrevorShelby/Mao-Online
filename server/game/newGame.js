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

	table.sendEvent(table.playerIDs, 'gameStarted')
	startNewRound(table)
}





//Sets up a game and seats connections into a round in play with some starter rules.
function createNewGame(table, sendEvent) {
	const playerIDs = Array.from(table.playerConnections.keys())
	const round = getNewRound(playerIDs)

	const rules = {
		starterRules: [
			'When a spades card is played, the person who played it has to say the card\'s suit and'
				+ ' rank.',
			'When an ace card is played, the order of player reverses.',
			'When a jack card is played, a player can name the next suit that has to be played.'
		],
		playerRules: []
	}

	const game = {
		playerIDs,
		round,
		rules,
		inBetweenRounds: false, lastWinner: undefined, numRoundsPlayed: 0
	}
	game.round.endRound = (winningSeat) => {
		game.inBetweenRounds = true
		game.lastWinner = game.round.seating[winningSeat]

		sendEvent(game.round.seating, 'roundOver', winningSeat)
		game.round = undefined

		game.numRoundsPlayed += 1
		if(game.numRoundsPlayed == table.options.roundLimit) {
			sendEvent(table.game.playerIDs, 'gameEnded')
			table.playerConnections.forEach( (conn) => {conn.close()})
		}
	}
	return game
}



module.exports = startNewGame