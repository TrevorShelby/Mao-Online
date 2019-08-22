const getPlayingCard = require('../playingCard.js')
const { sendEvent_ } = require('../sendMessage.js')
const startLastChance = require('../startLastChance.js')



function moveCard_(game, cardMovingSeat) {
	const notifyMover = (data) => { 
		sendEvent_(game, game.round.seating[cardMovingSeat])('cardMoved', data)
	}
	const notifyOthers = (data) => { 
		//using game.round.seating instead of game.playerConnections, since moveCard affects the
		//round.
		const otherPlayerIDs = game.round.seating.filter( (_, anotherPlayerSeat) => {
			return cardMovingSeat != anotherPlayerSeat
		})
		sendEvent_(game, otherPlayerIDs)('cardMoved', data)
	}

	function moveCard({from, to}={}) {
		if(game.inBetweenRounds) { return }
		if(game.round.mode != 'play') { return }

		if(typeof from != 'object' || typeof to != 'object') { return }
		if(from.source == 'hand' && to.source == 'hand') { return }
		if(
			from.source == 'pile' && to.source == 'pile'
			&& from.pileIndex == to.pileIndex && from.cardIndex == to.cardIndex
		) { return }
		if(from.source == 'deck' && to.source == 'deck') { return }

		//getCard is assigned instead of card, so that if an invalid 'to' object is supplied, the
		//card won't already be taken from its place. In other words, if card was assigned instead,
		//it would have to be removed from its source before the 'to' object gets validated.
		//eventFrom is the from object that is seen by the other players in the event notification
		//of this action that gets forwarded to them.
		let getCard, eventFrom
		if(from.source == 'hand') {
			const hand = game.round.hands[cardMovingSeat]
			if(!(from.cardIndex in hand)) { return }
			getCard = () => {return hand.splice(from.cardIndex, 1)[0]}
			eventFrom = {source: 'hand', length: hand.length - 1}
		}
		else if(from.source == 'pile') {
			if(!(from.pileIndex in game.round.piles)) { return }
			const pile = game.round.piles[from.pileIndex]
			if(!(from.cardIndex in pile.cards)) { return }
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
			const hand = game.round.hands[cardMovingSeat]
			const card = getCard()
			const cardIndex = hand.push(card) - 1

			notifyMover({ 
				card, cardIndex,
				from, to, by: cardMovingSeat 
			})
			const data = {
				from, //can't be hand-from if to is a hand-to is. no eventFrom necessary.
				to: {source: 'hand', length: hand.length},
				by: cardMovingSeat
			}
			if(from.source != 'deck') { data.card = card }
			notifyOthers(data)
		}
		else if(to.source == 'pile') {
			if(!(to.pileIndex in game.round.piles)) { return }
			const pile = game.round.piles[to.pileIndex]
			//similar to `to.cardIndex in pile`, but checks to see if to.cardIndex is appending.
			if(
				typeof to.cardIndex != 'number'
				|| (to.cardIndex < 0 || to.cardIndex > pile.length)
			) { return }
			const card = getCard()
			pile.cards.splice(to.cardIndex, 0, card)
			const data = { card, from: eventFrom, to, by: cardMovingSeat }
			notifyMover(data)
			notifyOthers(data)
		}
		else if(to.source == 'deck') {
			const card = getCard()
			notifyMover({
				card,
				from: eventFrom, to, by: cardMovingSeat
			})
			const cardMovedEvent = { from: eventFrom, to, by: cardMovingSeat }
			if(from.source != 'hand') { cardMovedEvent.card = card }
			notifyOthers(cardMovedEvent)
		}
		//TODO: Might require removing or changing
		else { return }

		if(from.source == 'hand' && game.round.hands[cardMovingSeat].length == 0) {
			startLastChance(game, cardMovingSeat)
		}
	}


	return moveCard
}



module.exports = moveCard_