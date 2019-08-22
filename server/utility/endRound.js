const { sendEvent_ } = require('./sendMessage.js')



function endRound(game, winningPlayerID) {
	game.round.lastChance = undefined
	game.round.mode = undefined
	game.inBetweenRounds = true
	game.round.winner = winningPlayerID
}



module.exports = endRound