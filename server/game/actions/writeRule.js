const startNewRound = require('../newRound.js')



function writeRule_(table, authorID) {
	function writeRule(rule=undefined) {
		if(table.mode != 'inBetweenRounds') return
		if(table.lastWinner != authorID) return

		if(typeof rule != 'string' && rule.length < 200) return

		table.rules.playerMade.push({ rule, author: authorID })
		table.sendEvent([authorID], 'ruleWrote', rule)

		startNewRound(table)
	}
	return writeRule
}



module.exports = writeRule_