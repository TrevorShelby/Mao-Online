const getPlayingCard = require('../playingCard.js')
const startLastChance = require('../startLastChance.js')



function moveCard_(table, cardMoverID) {
	function moveCard({from, to}={}) {
		if(table.mode != 'round') return
		if(table.round.mode != 'play') return

		if(typeof from != 'object' || typeof to != 'object') return
		if(from.source == 'hand' && to.source == 'hand') return
		if(
			from.source == 'pile' && to.source == 'pile'
			&& from.pileIndex == to.pileIndex && from.cardIndex == to.cardIndex
		) return
		if(from.source == 'deck' && to.source == 'deck') return

		const round = table.round
		let takeCard, othersFrom
		if(from.source == 'hand') {
			const hand = round.hands[cardMoverID]
			if(!(from.cardIndex in hand)) return
			getCard = () => hand.splice(from.cardIndex, 1)[0]
			othersFrom = {source: 'hand', length: hand.length - 1}
		}
		else if(from.source == 'pile') {
			if(!(from.pileIndex in round.piles)) return
			const pile = round.piles[from.pileIndex]
			if(!(from.cardIndex in pile.cards)) return
			getCard = () => pile.cards.splice(from.cardIndex, 1)[0]
			othersFrom = from
		}
		else if(from.source == 'deck') {
			getCard = () => getPlayingCard(Math.floor(Math.random() * 52))
			othersFrom = from
		}
		else return

		const getOthers = () => table.playerIDs.filter( playerID => playerID != cardMoverID )
		if(to.source == 'hand') {
			const hand = round.hands[cardMovingID]
			const card = getCard()
			hand.push(card)

			const event = { from, to: {source: 'hand', length: hand.length}, by: cardMoverID }
			if(from.source == 'pile') {
				table.sendEvent(table.playerIDs, 'cardMoved', Object.assign({card}, event))
			}
			else {
				table.sendEvent([cardMoverID], 'cardMoved', Object.assign({card}, event))
				table.sendEvent(getOthers(), 'cardMoved', event)
			}
		}
		else if(to.source == 'pile') {
			if(!(to.pileIndex in round.piles)) return
			const pile = round.piles[to.pileIndex]
			//similar to "to.cardIndex in pile", but checks to see if to.cardIndex is appending.
			if(
				typeof to.cardIndex != 'number'
				|| (to.cardIndex < 0 || to.cardIndex > pile.length)
			) return
			const card = getCard()
			pile.cards.splice(to.cardIndex, 0, card)
			table.sendEvent([cardMoverID], 'cardMoved', {card, from, to, by: cardMoverID})
			table.sendEvent(
				getOthers(), 'cardMoved', {card, from: othersFrom, to, by: cardMoverID}
			)
		}
		else if(to.source == 'deck') {
			const card = getCard()
			table.sendEvent([cardMoverID], 'cardMoved', {card, from, to, by: cardMoverID})
			const othersEvent = { from: othersFrom, to, by: cardMovingID }
			if(from.source != 'hand') othersEvent.card = card
			table.sendEvent(getOthers(), 'cardMoved', othersEvent)
		}
		else return

		if(from.source == 'hand' && round.hands[cardMoverID].length == 0) {
			startLastChance(table, cardMoverID)
		}
	}
	return moveCard
}



function moveCard1(round, sendEvent, cardMovingSeat, {from, to}={}) {
	if(round.mode != 'play') { return }

	if(typeof from != 'object' || typeof to != 'object') { return }
	if(from.source == 'hand' && to.source == 'hand') { return }
	if(
		from.source == 'pile' && to.source == 'pile'
		&& from.pileIndex == to.pileIndex && from.cardIndex == to.cardIndex
	) { return }
	if(from.source == 'deck' && to.source == 'deck') { return }



	const notifyMover = (data) => { 
		sendEvent([round.seating[cardMovingSeat]], 'cardMoved', data)
	}
	const notifyOthers = (data) => { 
		const otherPlayerIDs = round.seating.filter( (_, anotherPlayerSeat) => {
			return cardMovingSeat != anotherPlayerSeat
		})
		sendEvent(otherPlayerIDs, 'cardMoved', data)
	}


	//getCard is assigned instead of card, so that if an invalid 'to' object is supplied, the
	//card won't already be taken from its place. In other words, if card was assigned instead,
	//it would have to be removed from its source before the 'to' object gets validated.
	//eventFrom is the from object that is seen by the other players in the event notification
	//of this action that gets forwarded to them.
	let getCard, eventFrom
	if(from.source == 'hand') {
		const hand = round.hands[cardMovingSeat]
		if(!(from.cardIndex in hand)) { return }
		getCard = () => {return hand.splice(from.cardIndex, 1)[0]}
		eventFrom = {source: 'hand', length: hand.length - 1}
	}
	else if(from.source == 'pile') {
		if(!(from.pileIndex in round.piles)) { return }
		const pile = round.piles[from.pileIndex]
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
		const hand = round.hands[cardMovingSeat]
		const card = getCard()
		hand.push(card)

		notifyMover({
			card,
			from, to: { source: 'hand', length: hand.length },
			by: cardMovingSeat 
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
		if(!(to.pileIndex in round.piles)) { return }
		const pile = round.piles[to.pileIndex]
		//similar to `to.cardIndex in pile`, but checks to see if to.cardIndex is appending.
		if(
			typeof to.cardIndex != 'number'
			|| (to.cardIndex < 0 || to.cardIndex > pile.length)
		) { return }
		const card = getCard()
		pile.cards.splice(to.cardIndex, 0, card)
		notifyMover({card, from, to, by: cardMovingSeat})
		const data = { card, from: eventFrom, to, by: cardMovingSeat }
		notifyOthers(data)
	}
	else if(to.source == 'deck') {
		const card = getCard()
		notifyMover({card, from, to, by: cardMovingSeat})
		const data = { from: eventFrom, to, by: cardMovingSeat }
		//TODO: FIX
		if(from.source != 'hand') { cardMovedEvent.card = card }
		notifyOthers(data)
	}
	//TODO: Might require removing or changing
	else { return }

	if(from.source == 'hand' && round.hands[cardMovingSeat].length == 0) {
		startLastChance(round, sendEvent, cardMovingSeat)
	}
}



module.exports = moveCard_