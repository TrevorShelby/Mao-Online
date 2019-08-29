const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const createNewTable = require('../newTable.js')



const connections = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn) => {
	connections.push(conn)
})


const table = createNewTable({playersToStart: 4, roundLimit: 10})

const address = 'ws://127.0.0.1:1258'
const client1 = new WebSocket(address); const client2 = new WebSocket(address); client3 = new WebSocket(address)
const client4 = new WebSocket(address).once('open', async () => {



client4.on('message', (messageStr) => {
	const message = safeJsonParse(messageStr)
	console.log(message)
})

connections.forEach( (conn) => {
	table.addPlayer(conn, uuidv4())
})
await waitFor('roundStarted')
doAction(client1, 'accuse', 1)

await waitFor('playerAccused')
doAction(client1, 'acceptAccusation')
doAction(client3, 'acceptAccusation')
doAction(client2, 'cancelAccusation')
doAction(client3, 'cancelAccusation')
await new Promise( (resolve) => {setTimeout(resolve, 100)} )
if(table.game.round.mode != 'accusation') {throw new Error('mode not accusation')}
doAction(client2, 'acceptAccusation')
await waitFor('accusationAccepted')
doAction(client1, 'accuse', 1)
doAction(client1, 'cancelAccusation')
await waitFor('accusationCancelled')
console.log('done')

table.game.round.hands[0] = [ {value: 0, rank: 0, suit: 0} ]
doAction(client1, 'moveCard', {
	from: {source: 'hand', cardIndex: 0},
	to: {source: 'pile', pileIndex: 0, cardIndex: 1}
})

await waitFor('lastChanceStarted')
doAction(client2, 'accuse', 3)
await new Promise( (resolve) => {setTimeout(resolve, 300)})
if(table.game.round.mode != 'lastChance') {throw new Error('mode not lastChance')}
doAction(client2, 'accuse', 0)
await waitFor('playerAccused')
doAction(client2, 'cancelAccusation')
await waitFor('accusationCancelled')
if(table.game.round.mode != 'lastChance') {throw new Error('mode not lastChance')}
doAction(client2, 'accuse', 0)
doAction(client1, 'acceptAccusation')
await waitFor('accusationAccepted')
if(table.game.round.mode != 'play') {throw new Error('mode not play')}
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
