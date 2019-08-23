const WebSocket = require('ws')
const uuiv4 = require('uuid/v4')

const createNewTable = require('../mao/newTable.js')



const connections = []
const numPlayersToStart = 4
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', onConnectionDuringLobby)

let table
function onConnectionDuringLobby(conn) {
	connections.push(conn)
	if(connections.length == 1) {
		table = createNewTable({
			connection: conn, hostID: uuidv4()
		}, 5)
	}
	else {
		table.addPlayer(connection, uuidv4())
	}
}