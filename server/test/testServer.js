const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const createNewTable = require('../mao/newTable.js')



const table = createNewTable(3)
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', onConnectionDuringLobby)

function onConnectionDuringLobby(conn) {
	table.addPlayer(conn, uuidv4())
	if(table.lobby.playersToStart == table.playerConnections.size) {
		wsServer.off('connection', onConnectionDuringLobby)
	}
}