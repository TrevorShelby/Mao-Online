const getPlayingCard = require('./playingCard.js')
const sendMessage_ = require('./sendMessage.js')



//TODO: Fix. A valid from object and an invalid to object will end with the function removing the
//card from the round without placing it anywhere. What should happen instead is nothing.
function moveCard_(round, playerIndex) {
	const sendMessage = sendMessage_(round, playerIndex)
	function moveCard(ackUID, {from, to, action}) {
		if(typeof from != 'object' || typeof to != 'object') { return }
		if(from.source == 'hand' && to.source == 'hand') { return }
		//TODO: Add more redundancy checks like above.

		let card
		//TODO: Add cardIndex validation
		if(from.source == 'hand') {
			const hand = round.hands[playerIndex]
			card = hand.splice(from.cardIndex, 1)[0]
		}
		//TODO: Add pileIndex and cardIndex validation
		else if(from.source == 'pile') {
			const pile = round.piles[from.pileIndex]
			card = pile.cards.splice(from.cardIndex, 1)[0]
		}
		else if(from.source == 'deck') {
			const cardValue = Math.floor(Math.random() * 52)
			card = getPlayingCard(cardValue)
		}
		//TODO: Might require removing or changing
		else { return }

		if(to.source == 'hand') {
			const hand = round.hands[playerIndex]
			const cardIndex = hand.push(card)
			//acknowledgement
			sendMessage({
				type: 'ack',
				ackUID,
				data: { card, cardIndex }
			})
		}
		//TODO: pileIndex and cardIndex validation
		else if(to.source == 'pile') {
			const pile = round.piles[to.pileIndex]
			pile.cards.splice(to.cardIndex, 0, card)
			sendMessage({
				type: 'ack',
				ackUID,
				data: { card }
			})
		}
		//Intentionally blank. Using the deck as the to-source tells game to destroy card.
		else if(to.source == 'deck') {}
		//TODO: Might require removing or changing
		else { return }
	}
	return moveCard
}


module.exports.moveCard_ = moveCard_