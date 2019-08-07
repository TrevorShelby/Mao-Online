const getPlayingCard = require('./playingCard.js')



function draw() {
	const cardValue = Math.floor(Math.random() * 52)
	return getPlayingCard(cardValue)
}


function getNewRound(players) {
	const piles = [{
		owner: undefined,
		cards: [{
			isFaceUp: true,
			identity: draw()
		}]
	}]

	const hands = new Map()
	players.forEach( (player) => {
		const hand = []
		for(let i = 0; i < 7; i++) { hand.push(draw()) }
		hands.set(player, hand)
	} )

	return { piles, hands }
}



module.exports.draw = draw
module.exports.getNewRound = getNewRound