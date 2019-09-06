const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const createNewTable = require('../newTable.js')



const connections = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', conn => connections.push(conn) )


const table = createNewTable({playersToStart: 4, roundLimit: 1})

const address = 'ws://127.0.0.1:1258'
const client1 = new WebSocket(address); const client2 = new WebSocket(address); client3 = new WebSocket(address)
const client4 = new WebSocket(address).once('open', async () => {



client4.on('message', messageStr => {
	const message = safeJsonParse(messageStr)
	console.log(message)
})

connections.forEach( conn => table.addPlayer(uuidv4(), conn) )
doAction(client4, 'talk', 'hello')
await waitFor('roundStarted')

while(table.round.hands[table.playerIDs[0]].length > 0) {
	await new Promise( resolve => setTimeout(resolve, 100) )
	doAction(client1, 'moveCard', {
		from: {source: 'hand', cardIndex: 0},
		to: {source: 'pile', pileIndex: 0, cardIndex: 0}//table.round.piles[0].cards.length - 1}
	})
}
await waitFor('gameEnded')
console.log('done')




})



function waitFor(eventName) {
	return new Promise( (resolve) => {
		client4.on('message', (messageStr) => {
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
