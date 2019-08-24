const createNewGame = require('../newGame.js')



function startGame_(table, sendEvent, starterID) {
	function startGame() {
		if(table.mode != 'lobby') { return }
		if(starterID != table.hostID) { return }

		table.mode = 'game'
		//Passing sendEvent here is find. startGame could just as well have used the createNewGame
		//code. It doesn't though, because that would make it a bit messier.
		table.game = createNewGame(table.playerConnections, sendEvent)
		sendEvent(table.game.playerIDs, 'gameStarted')
		const discard = table.game.round.piles[0].cards
		table.game.round.seating.forEach( (playerID, seat) => {
			const hand = table.game.round.hands[seat]
			sendEvent([playerID], 'roundStarted', {hand, discard})
		})
	}
	return startGame
}



module.exports = startGame_