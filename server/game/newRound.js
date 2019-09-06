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
		sendEvent([playerID], 'roundStarted', {
			you: {hand, seat}, discard
		})
	})
}



function getNewRound1(playerIDs) {
	const seating = playerIDs.slice() //copies array
	const hands = []
	for(let seat = 0; seat < seating.length; seat++) {
		const hand = []
		for(let cardNum = 0; cardNum < 7; cardNum++) {
			const cardValue = Math.floor(Math.random() * 52)
			hand.push(getPlayingCard(cardValue))
		}
		hands.push(hand)
	}
	const topCard = getPlayingCard(Math.floor(Math.random() * 52))
	const piles = [{owner: undefined, cards: [topCard]}]
	return { 
		hands, piles, seating,
		mode: 'play', accusation: undefined, winningSeat: undefined
	}
}



module.exports = startNewRound