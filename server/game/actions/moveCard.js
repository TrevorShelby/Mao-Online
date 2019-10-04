const getPlayingCard = require('../playingCard.js')
const startLastChance = require('../startLastChance.js')



//TODO: Write unit test
function moveCard_(table, cardMoverID) {
	function moveCard({from, to}={}) {
		if(table.mode != 'round') return
		if(table.round.mode != 'play') return

		const round = table.round

		const isDataValid = (() => {
			if(Date.now() - round.timeOfLastCardMove < 1000) return

			if(typeof from != 'object' || typeof to != 'object') return
			if(from.source == 'hand' && to.source == 'hand') return
			if(from.source == 'discard' && to.source == 'discard') return
			if(from.source == 'deck' && to.source == 'deck') return

			if(from.source == 'hand' && !(from.cardIndex in round.hands[cardMoverID])) return false
			if(to.source == 'hand' && round.hands[cardMoverID].length >= 24) return false

			if(from.source == 'discard' && !(from.cardIndex in round.discard)) return false

			if(
				to.source == 'discard' && (
					typeof to.cardIndex != 'number'
					|| (to.cardIndex < 0 || to.cardIndex > round.discard.length)
				)
			) return false

			return true
		})()
		if(!isDataValid) return

		const movedCard = (() => {
			if(from.source == 'hand')
				return round.hands[cardMoverID].splice(from.cardIndex, 1)[0]
			else if(from.source == 'discard')
				return round.discard.splice(from.cardIndex, 1)[0]
			else if(from.source == 'deck')
				return getPlayingCard(Math.floor(Math.random() * 52))
		})()

		round.timeOfLastCardMove = Date.now()
		if(to.source == 'hand') round.hands[cardMoverID].push(movedCard)
		else if(to.source == 'discard') round.discard.splice(to.cardIndex, 0, movedCard)

		const dataObjs = (card => {
			const moverData = { card }
			const othersData = {}

			moverData.by = othersData.by = cardMoverID
			moverData.at = othersData.at = round.timeOfLastCardMove

			if(from.source == 'discard' || to.source == 'discard')
				othersData.card = moverData.card

			if(from.source == 'hand') {
				moverData.from = { source: 'hand', cardIndex: from.cardIndex }
				othersData.from = { source: 'hand', length: round.hands[cardMoverID].length }
			}
			else if(to.source == 'hand')
				moverData.to = othersData.to = {
					source: 'hand', length: round.hands[cardMoverID].length
				}

			if(from.source == 'discard')
				moverData.from = othersData.from = { source: 'discard', cardIndex: from.cardIndex }
			else if(to.source == 'discard')
				moverData.to = othersData.to = { source: 'discard', cardIndex: to.cardIndex }

			if(from.source == 'deck')
				moverData.from = othersData.from = { source: 'deck' }
			else if(to.source == 'deck')
				moverData.to = othersData.to = { source: 'deck' }

			return { mover: moverData, others: othersData }
		})(movedCard)

		const others = table.playerIDs.filter( playerID => playerID != cardMoverID )
		table.sendEvent(others, 'cardMoved', dataObjs.others)
		table.sendEvent([cardMoverID], 'cardMoved', dataObjs.mover)

		if(from.source == 'hand' && round.hands[cardMoverID].length == 0)
			startLastChance(table, cardMoverID)
	}
	return moveCard
}


module.exports = moveCard_