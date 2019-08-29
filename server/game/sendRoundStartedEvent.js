function sendRoundStartedEvent(round, sendEvent) {
	const discard = round.piles[0].cards
	round.seating.forEach( (playerID, seat) => {
		const hand = round.hands[seat]
		sendEvent([playerID], 'roundStarted', {
			you: {hand, seat}, discard, seating: round.seating
		})
	})
}



module.exports = sendRoundStartedEvent