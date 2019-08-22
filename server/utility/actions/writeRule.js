const { sendEvent_ } = require('../sendMessage.js')
const getPlayingCard = require('../playingCard.js')
const getNewRound = require('../newRound.js')



function writeRule_(game, actionPools, authorID) {
	function writeRule(rule=undefined) {
		if(game.inBetweenRound && game.lastWinner == authorID) { return }

		if(typeof rule != 'string') { return }

		game.rules.roundRules.push({ rule, author: authorID })
		sendEvent_(game, [authorID])('ruleWrote', rule)

		game.round = getNewRound(game.round.seating)
		sendEvent_(game, game.round.seating)('roundStarted')
	}
	return writeRule
}



module.exports = writeRule_