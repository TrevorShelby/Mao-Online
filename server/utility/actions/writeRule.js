const { sendEvent_ } = require('../sendMessage.js')
const getPlayingCard = require('../playingCard.js')
const getNewRound = require('../newRound.js')



const legalActionNamesDuringPlay = ['talk', 'moveCard', 'accuse']

function writeRule_(game, seatedActionPools, authorID) {
	function writeRule(rule=undefined) {
		if(typeof rule != 'string') { return }

		game.rules.roundRules.push({ rule, author: authorID })
		sendEvent_(game, [authorID])('ruleWrote', rule)

		game.round = getNewRound(game.round.seating)
		seatedActionPools.forEach( (actionPool, poolOwnerSeat) => {
			for(let actionName in actionPool.active) {
				if(!legalActionNamesDuringPlay.includes(actionName)) {
					delete actionPool.active[actionName]
				}
			}
			legalActionNamesDuringPlay.forEach( (actionName) => {
				if(actionPool.active[actionName] == undefined) {
					actionPool.activate(actionName)
				}
			})
		})
		sendEvent_(game, game.round.seating)('roundStarted')
	}
	return writeRule
}



module.exports = writeRule_