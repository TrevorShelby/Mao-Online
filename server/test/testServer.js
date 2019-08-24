const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const createNewTable = require('../mao/newTable.js')



const connections = []
const numPlayersToStart = 4
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', onConnectionDuringLobby)

let table
function onConnectionDuringLobby(conn) {
	connections.push(conn)
	if(connections.length == 1) {
		const hostID = uuidv4()
		table = createNewTable({
			connection: conn, playerID: hostID
		}, 5)
		conn.send(JSON.stringify({
			type: 'event', name: 'tableJoined', data: {
				uuid: hostID, isHost: true
			}
		}))
	}
	else {
		const playerID = uuidv4()
		table.addPlayer(conn, playerID)
		conn.send(JSON.stringify({
			type: 'event', name: 'tableJoined', data: {
				uuid: playerID, isHost: false
			}
		}))
	}
}


async function restartWhenNeeded() {
	while(true) {
		await new Promise( (resolve) => {setTimeout(resolve, 5000)} )
		
	}
}