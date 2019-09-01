const { Hand, tableEvents } = require('../hookComponents.js')


// <script src='scripts/tableEvents.js'></script>
// <script src='scripts/card.js'></script>
// <script src='scripts/hand.js'></script>
// <script src='scripts/hookComponents.js'></script>


tableEvents.on('roundStarted', (table) => {
	const hand = table.game.round.me.hand
	const handContainer = document.createElement('div')
	document.body.appendChild(handContainer)
	ReactDOM.render(
		React.createElement(Hand, {startingHand: hand}, null),
		handContainer
	)
})