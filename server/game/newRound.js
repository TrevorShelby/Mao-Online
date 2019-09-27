const getPlayingCard = require('./playingCard.js')



const drawCard = () => getPlayingCard(Math.floor(Math.random() * 52))

function startNewRound(table) {
	const round = table.round = {}
	round.hands = {}
	table.connections.forEach( ([playerID]) => {
		const cards = []
		for(let cardNum = 0; cardNum < 7; cardNum++) cards.push(drawCard())
		round.hands[playerID] = cards
	})
	round.discard = [drawCard()]
	round.mode = 'play'
	round.winningPlayer = undefined
	round.timeOfLastCardMove = -1

	table.mode = 'round'
	table.playerIDs.forEach( playerID => {
		const hand = round.hands[playerID]
		table.sendEvent([playerID], 'roundStarted', {
			yourHand: hand, discard: round.discard
		})
	})
}



module.exports = startNewRound