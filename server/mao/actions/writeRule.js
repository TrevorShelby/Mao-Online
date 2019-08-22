const getNewRound = require('../newRound.js')



function writeRule_(game, authorID) {
	function writeRule(rule=undefined) {
		if(!game.inBetweenRounds) { return }
		if(game.lastWinner != authorID) { return }

		if(typeof rule != 'string' && rule.length < 200) { return }

		game.rules.roundRules.push({ rule, author: authorID })
		sendEvent_(game, [authorID])('ruleWrote', rule)

		game.round = getNewRound(game.round.seating)
		game.inBetweenRounds = false
		sendEvent(game.round.seating, 'roundStarted')
	}
	return writeRule
}



module.exports = writeRule_