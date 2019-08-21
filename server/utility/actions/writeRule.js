const { sendEvent_ } = require('../sendMessage.js')
const getPlayingCard = require('../playingCard.js')
const getNewRound = require('../newRound.js')



const legalActionNamesDuringPlay = ['talk', 'moveCard', 'accuse']

function writeRule_(game, actionPools, authorID) {
	function writeRule(rule=undefined) {
		if(typeof rule != 'string') { return }

		game.rules.roundRules.push({ rule, author: authorID })
		sendEvent_(game, [authorID])('ruleWrote', rule)

		game.round = getNewRound(game.round.seating)
		actionPools.forEach( (actionPool) => {
			actionPool.changeActivityByTags(
				(tags) => { return tags.includes('play') }
			)
		})
		sendEvent_(game, game.round.seating)('roundStarted')
	}
	return writeRule
}



module.exports = writeRule_