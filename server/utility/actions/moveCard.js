const getPlayingCard = require('../playingCard.js')
const { /*sendAck_,*/ sendEvent_ } = require('../sendMessage.js')



//TODO: Fix. A valid from object and an invalid to object will end with the function removing the
//card from the round without placing it anywhere. What should happen instead is nothing.
function moveCard_(game, playerID) {
	//TODO: Remove sendAck
	const sendAck = /*sendAck_(game, playerID)*/ () => {}
	const sendEvent = sendEvent_(game, playerID)
	function moveCard(ackUID, {from, to}={}) {
		if(typeof from != 'object' || typeof to != 'object') { return }
		if(from.source == 'hand' && to.source == 'hand') { return }
		if(
			from.source == 'pile' && to.source == 'pile'
			&& from.pileIndex == to.pileIndex && from.cardIndex == to.cardIndex
		) { return }
		if(from.source == 'deck' && to.source == 'deck') { return }
		const round = game.round
		const seat = round.seating.indexOf(playerID)

		//getCard is assigned instead of card, so that if an invalid 'to' object is supplied, the
		//card won't already be taken from its place. In other words, if card was assigned instead,
		//it would have to be removed from its source before the 'to' object gets validated.
		//eventFrom is the from object that is seen by the other players in the event notification
		//of this action that gets forwarded to them.
		let getCard, eventFrom
		if(from.source == 'hand') {
			const hand = round.hands[seat]
			if(!isValidIndex(from.cardIndex, hand)) { return }
			getCard = () => {return hand.splice(from.cardIndex, 1)[0]}
			eventFrom = {source: 'hand', length: hand.length - 1}
		}
		else if(from.source == 'pile') {
			if(!isValidIndex(from.pileIndex, round.piles)) { return }
			const pile = round.piles[from.pileIndex]
			if(!isValidIndex(from.cardIndex, pile.cards)) { return }
			getCard = () => {return pile.cards.splice(from.cardIndex, 1)[0]}
			eventFrom = from
		}
		else if(from.source == 'deck') {
			getCard = () => {
				const cardValue = Math.floor(Math.random() * 52)
				return getPlayingCard(cardValue)
			}
			eventFrom = from
		}
		//TODO: Might require removing or changing
		else { return }

		if(to.source == 'hand') {
			const hand = round.hands[seat]
			const card = getCard()
			const cardIndex = hand.push(card) - 1

			sendAck(ackUID, { card, cardIndex })
			const data = {
				from: from, //from-source can't be hand if to-source is. no eventFrom necessary.
				to: {source: 'hand', length: hand.length},
				by: seat
			}
			if(from.source != 'deck') { data.card = card }
			sendEvent('cardMoved', data)
		}
		else if(to.source == 'pile') {
			if(!isValidIndex(to.pileIndex, round.piles)) { return }
			const pile = round.piles[to.pileIndex]
			//isValidIndex isn't called, since an index equal to the length of the pile is also
			//allowed (i.e. appending).
			if(
				typeof to.cardIndex != 'number'
				|| (to.cardIndex < 0 || to.cardIndex > pile.length)
			) { return }
			const card = getCard()
			pile.cards.splice(to.cardIndex, 0, card)
			sendAck(ackUID, { card })
			sendEvent('cardMoved', {
				card,
				from: eventFrom,
				to,
				by: seat
			})
		}
		else if(to.source == 'deck') {
			const card = getCard()
			sendAck(ackUID, { card })
			const cardMovedEvent = { from: eventFrom, to, by: seat }
			if(from.source != 'hand') { cardMovedEvent.card = card }
			sendEvent('cardMoved', cardMovedEvent)
		}
		//TODO: Might require removing or changing
		else { return }
	}


	return moveCard
}


function isValidIndex(index, array) {
	if(typeof index != 'number') { return false }
	else if(index < 0 || index >= array.length) { return false }
	else { return true }
}


module.exports = moveCard_