tableEvents.on('roundStarted', (table) => {
	const hand = table.game.round.me.hand
	const handContainer = document.createElement('div')
	document.body.appendChild(handContainer)
	ReactDOM.render(
		React.createElement(Hand, {startingHand: hand}, null),
		handContainer
	)
})