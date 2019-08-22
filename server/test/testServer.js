const WebSocket = require('ws')

const { createNewGame, addGameActions } = require('../mao/newGame.js')


const connections = []
const numPlayersToStart = 4
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', onConnectionDuringLobby)

function onConnectionDuringLobby(conn) {
	connections.push(conn)
	if(connections.length == numPlayersToStart) {
		wsServer.off('connection', onConnectionDuringLobby)
		const game = createNewGame(0, connections)
		addGameActions(game)
	}
}