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



module.exports = moveCard_