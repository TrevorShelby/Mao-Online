const getNewRound = require('./newRound.js')
const onActionMessage_ = require('./onActionMessage.js')



//Sets up a game and seats connections into a round in play with some starter rules.
function createNewGame(playerConnections, /*roundLimit,*/ sendEvent/*, endGame*/) {
	const playerIDs = Array.from(playerConnections.keys())
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
		// if(game.numRoundsPlayed == roundLimit) {
		// 	endGame()
		// }
	}
	return game
}



module.exports = createNewGame