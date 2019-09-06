const getPlayingCard = require('./playingCard.js')



const drawRandom = () => getPlayingCard(Math.floor(Math.random() * 52))

function startNewRound(table) {
	table.round = round = {}
	round.hands = {}
	table.connections.forEach( ([playerID]) => {
		const cards = []
		for(let cardNum = 0; cardNum < 7; cardNum++) { cards.push(drawRandom()) }
		round.hands[playerID] = cards
	})
	round.piles = [ {owner: undefined, cards: [drawRandom()]} ]
	round.mode = 'play'
	round.winningPlayer = undefined

	table.mode = 'round'

	const discard = round.piles[0].cards
	table.playerIDs.forEach( playerID => {
		const hand = round.hands[playerID]
		table.sendEvent([playerID], 'roundStarted', {
			yourHand: hand, discard
		})
	})
}



module.exports = startNewRound