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



client4.on('message', (messageStr) => {
	const message = safeJsonParse(messageStr)
	console.log(message)
})

connections.forEach( conn => table.addPlayer(uuidv4(), conn) )
await waitFor('roundStarted')

const futureWinnerID = table.playerIDs[0]
table.round.hands[futureWinnerID] = [ {value: 0, rank: 0, suit: 0} ]
doAction(client1, 'moveCard', {
	from: {source: 'hand', cardIndex: 0},
	to: {source: 'discard', cardIndex: 1}
})
await waitFor('lastChanceStarted')
if(table.round.mode != 'lastChance') throw new Error('mode not lastChance')
if(table.round.winningPlayer != futureWinnerID) throw new Error('winningPlayer incorrect')

console.log('10 second pause here')
await waitFor('roundOver')
if(!table.mode == 'inBetweenRounds') throw new Error('round still in progress')
if(table.lastWinner != futureWinnerID) throw new Error('winner incorrect')
await new Promise( (resolve) => setTimeout(resolve, 100))
if(table.mode != 'lobby') throw new Error('mode not lobby')
console.log('done')
console.log(table)

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
