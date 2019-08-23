const createNewGame = require('../newGame.js')



function startGame_(table, sendEvent, starterID) {
	function startGame() {
		if(table.mode != 'lobby') { return }
		if(starterID != table.hostID) { return }

		table.mode = 'game'
		table.game = createNewGame(table.playerConnections, sendEvent)
		sendEvent(table.game.playerIDs, 'gameStarted')
		sendEvent(table.game.round.seating, 'roundStarted')
	}
	return startGame
}



module.exports = startGame_