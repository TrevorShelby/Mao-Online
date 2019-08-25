const getNewRound = require('../newRound.js')



function writeRule_(table, sendEvent, authorID) {
	function writeRule(rule=undefined) {
		if(table.game == undefined) { return }
		if(!table.game.inBetweenRounds) { return }
		if(table.game.lastWinner != authorID) { return }

		if(typeof rule != 'string' && rule.length < 200) { return }

		table.game.rules.playerRules.push({ rule, author: authorID })
		sendEvent([authorID], 'ruleWrote', rule)

		table.game.round = getNewRound(table.game.playerIDs)
		table.game.inBetweenRounds = false
		sendEvent(table.game.round.seating, 'roundStarted')
	}
	return writeRule
}



module.exports = writeRule_