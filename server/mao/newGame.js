const getNewRound = require('./newRound.js')
const onActionMessage_ = require('./onActionMessage.js')



//This module is not to be used in production. Only to help with discovery and testing.


//Sets up a game and seats connections into a round in play with some round 0 rules.
function createNewGame(playerConnections, sendEvent) {
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

	const inBetweenRounds = false

	const game = {
		playerIDs,
		round,
		rules,
		inBetweenRounds
	}
	game.round.endRound = (winningPlayerID) => {
		game.inBetweenRounds = true
		game.lastWinner = winningPlayerID

		sendEvent(game.round.seating, 'roundOver', winningSeat)
		game.round = undefined
	}
	return game
}



module.exports = createNewGame