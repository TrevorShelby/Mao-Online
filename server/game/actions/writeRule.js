const getNewRound = require('../newRound.js')
const sendRoundStartedEvent = require('../sendRoundStartedEvent.js')



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
		sendRoundStartedEvent(table.game.round, sendEvent)
	}
	return writeRule
}



module.exports = writeRule_