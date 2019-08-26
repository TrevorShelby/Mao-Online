const getPlayingCard = require('./playingCard.js')



function getNewRound(playerIDs) {
	const seating = playerIDs.concat([])
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



module.exports = getNewRound