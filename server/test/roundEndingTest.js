const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const createNewTable = require('../mao/newTable.js')



const connections = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn) => {
	connections.push(conn)
})


const table = createNewTable(3)

const address = 'ws://127.0.0.1:1258'
const client1 = new WebSocket(address); const client2 = new WebSocket(address);
const client3 = new WebSocket(address).once('open', async () => {



client3.on('message', (messageStr) => {
	const message = safeJsonParse(messageStr)
	console.log(message)
})

connections.forEach( (conn) => {
	table.addPlayer(conn, uuidv4())
})

await waitFor('roundStarted')

table.game.round.hands[0] = [ {value: 0, rank: 0, suit: 0} ]

doAction(client1, 'moveCard', {
	from: {source: 'hand', cardIndex: 0},
	to: {source: 'pile', pileIndex: 0, cardIndex: 1}
})
await waitFor('roundOver')

client1.close()


})



function waitFor(eventName) {
	return new Promise( (resolve) => {
		client3.on('message', (messageStr) => {
			const message = safeJsonParse(messageStr)
			if(message.name == eventName) { resolve() }
		})
	})
}



function doAction(client, name, args) {
	client.send(JSON.stringify({
		type: 'action', name, args
	}))
}




function safeJsonParse(objStr) {
	let obj
	try {
		obj = JSON.parse(objStr)
	}
	catch(err) {
		obj = objStr
	}
	return obj
}