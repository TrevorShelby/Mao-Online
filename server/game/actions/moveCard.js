const getPlayingCard = require('../playingCard.js')
const startLastChance = require('../startLastChance.js')



function moveCard_(table, cardMoverID) {
	function moveCard({from, to}={}) {
		if(table.mode != 'round') return
		if(table.round.mode != 'play') return

		if(typeof from != 'object' || typeof to != 'object') return
		if(from.source == 'hand' && to.source == 'hand') return
		if(from.source == 'discard' && to.source == 'discard') return
		if(from.source == 'deck' && to.source == 'deck') return


		const round = table.round
		if(to.source == 'hand' && round.hands[cardMoverID].length >= 24) return

		//TODO: Check to see if moveCard can return values outside of expected parameter list back to other players.
		let takeCard, othersFrom
		if(from.source == 'hand') {
			const hand = round.hands[cardMoverID]
			if(!(from.cardIndex in hand)) return
			getCard = () => hand.splice(from.cardIndex, 1)[0]
			othersFrom = {source: 'hand', length: hand.length - 1}
		}
		else if(from.source == 'discard') {
			if(!(from.cardIndex in round.discard)) return
			getCard = () => round.discard.splice(from.cardIndex, 1)[0]
			othersFrom = from
		}
		else if(from.source == 'deck') {
			getCard = () => getPlayingCard(Math.floor(Math.random() * 52))
			othersFrom = from
		}
		else return

		const getOthers = () => table.playerIDs.filter( playerID => playerID != cardMoverID )
		if(to.source == 'hand') {
			const hand = round.hands[cardMoverID]
			const card = getCard()
			hand.push(card)

			const event = { from, to: {source: 'hand', length: hand.length}, by: cardMoverID }
			if(from.source == 'discard') {
				table.sendEvent(table.playerIDs, 'cardMoved', Object.assign({card}, event))
			}
			else {
				table.sendEvent([cardMoverID], 'cardMoved', Object.assign({card}, event))
				table.sendEvent(getOthers(), 'cardMoved', event)
			}
		}
		else if(to.source == 'discard') {
			//similar to "to.cardIndex in round.discard", but also considers appending.
			if(
				typeof to.cardIndex != 'number'
				|| (to.cardIndex < 0 || to.cardIndex > round.discard.length)
			) return
			const card = getCard()
			round.discard.splice(to.cardIndex, 0, card)
			table.sendEvent([cardMoverID], 'cardMoved', {card, from, to, by: cardMoverID})
			table.sendEvent(
				getOthers(), 'cardMoved', {card, from: othersFrom, to, by: cardMoverID}
			)
		}
		else if(to.source == 'deck') {
			const card = getCard()
			table.sendEvent([cardMoverID], 'cardMoved', {card, from, to, by: cardMoverID})
			const othersEvent = { from: othersFrom, to, by: cardMoverID }
			if(from.source == 'discard') othersEvent.card = card
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