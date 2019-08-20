const { sendEvent_ } = require('../sendMessage.js')
const getPlayingCard = require('../playingCard.js')



const legalActionNamesDuringPlay = ['talk', 'moveCard', 'accuse']

function writeRule_(game, seatedActionPools, authorID) {
	function writeRule(rule=undefined) {
		if(typeof rule != 'string') { return }

		game.rules.roundRules.push({ rule, author: authorID })

		const hands = []
		for(let seat = 0; seat < game.round.seating.length; seat++) {
			const hand = []
			for(let cardNum = 0; cardNum < 7; cardNum++) {
				const cardValue = Math.floor(Math.random() * 52)
				hand.push(getPlayingCard(cardValue))
			}
			hands.push(hand)
		}
		const topCard = getPlayingCard(Math.floor(Math.random() * 52))
		const piles = [{owner: undefined, cards: [topCard]}]
		const round = { 
			hands, piles, seating: game.round.seating,
			mode: 'play', accusation: undefined, winner: undefined
		}
		game.round = round


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


		sendEvent_(game, game.round.seating)('roundStart')
	}
	return writeRule
}



module.exports = writeRule_