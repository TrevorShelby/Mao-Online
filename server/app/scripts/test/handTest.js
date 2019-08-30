tableEvents.on('roundStarted', ({you: {hand}}) => {
	const handContainer = document.createElement('div')
	document.body.appendChild(handContainer)
	ReactDOM.render(
		React.createElement(Hand, {startingHand: hand}, null),
		handContainer
	)
})