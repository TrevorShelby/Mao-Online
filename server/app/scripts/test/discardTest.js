const { Discard, tableEvents } = require('../hookComponents.js')
require('./handTest.js')


tableEvents.on('roundStarted', (table) => {
	const topCard = table.game.round.piles[0].cards[0]
	const discardContainer = document.createElement('div')
	document.body.appendChild(discardContainer)
	ReactDOM.render(
		React.createElement(Discard, {topCard}, null),
		discardContainer
	)
})