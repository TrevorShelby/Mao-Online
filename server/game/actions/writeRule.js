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



// function writeRule_1(table, sendEvent, authorID) {
// 	function writeRule(rule=undefined) {
// 		if(table.game == undefined) { return }
// 		if(!table.game.inBetweenRounds) { return }
// 		if(table.game.lastWinner != authorID) { return }

// 		if(typeof rule != 'string' && rule.length < 200) { return }

// 		table.game.rules.playerRules.push({ rule, author: authorID })
// 		sendEvent([authorID], 'ruleWrote', rule)

// 		table.game.round = getNewRound(table.game.playerIDs)
// 		table.game.inBetweenRounds = false
// 		sendRoundStartedEvent(table.game.round, sendEvent)
// 	}
// 	return writeRule
// }



module.exports = writeRule_