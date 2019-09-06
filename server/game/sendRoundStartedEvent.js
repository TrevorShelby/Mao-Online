function sendRoundStartedEvent(table) {
	const discard = table.round.piles[0].cards
	table.playerIDs.forEach( playerID => {
		const hand = table.round.hands.find( ([handOwnerID]) => playerID == handOwnerID)
		sendEvent([playerID], 'roundStarted', {
			you: {hand, seat}, discard
		})
	})
}



module.exports = sendRoundStartedEvent