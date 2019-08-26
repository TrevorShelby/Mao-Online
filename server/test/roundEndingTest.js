const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const createNewTable = require('../mao/newTable.js')



const connections = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn) => {
	connections.push(conn)
})


const table = createNewTable({playersToStart: 4})

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

const futureWinnerID = table.game.round.seating[0]
table.game.round.hands[0] = [ {value: 0, rank: 0, suit: 0} ]
doAction(client1, 'moveCard', {
	from: {source: 'hand', cardIndex: 0},
	to: {source: 'pile', pileIndex: 0, cardIndex: 1}
})
await waitFor('lastChanceStarted')
if(table.game.round.mode != 'lastChance') {throw new Error('mode not lastChance')}
if(table.game.round.winningSeat != 0) {throw new Error('winningSeat incorrect')}

console.log('10 second pause here')
await waitFor('roundOver')
if(!table.game.inBetweenRounds) {throw new Error('round still in progress')}
if(table.game.lastWinner != futureWinnerID) {throw new Error('winner incorrect')}
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