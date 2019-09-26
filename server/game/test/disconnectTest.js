const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const createNewTable = require('../newTable.js')



const connections = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', conn => connections.push(conn) )


const table = createNewTable({playersToStart: 4, roundLimit: 10})

const address = 'ws://127.0.0.1:1258'
const client1 = new WebSocket(address); const client2 = new WebSocket(address); client3 = new WebSocket(address)
const client4 = new WebSocket(address).once('open', async () => {



client4.on('message', (messageStr) => {
	const message = safeJsonParse(messageStr)
	console.log(message)
})
client4.on('close', () => console.log('closed!') )

connections.forEach( conn => table.addPlayer(uuidv4(), conn) )
await waitFor('roundStarted')
client2.close()

await waitFor('playerLeft')
//nothing should happen!!!
doAction(client1, 'accuse', undefined)

table.round.hands[table.playerIDs[0]] = [ {value: 0, rank: 0, suit: 0} ]
doAction(client1, 'moveCard', {
	from: {source: 'hand', cardIndex: 0},
	to: {source: 'discard', cardIndex: 1}
})

await waitFor('lastChanceStarted')
client1.close()
await waitFor('winningPlayerLeft')
if(table.round.mode != 'play') {throw new Error('mode not play')}
if(table.round.winningPlayer != undefined) {throw new Error('winning player exists.')}

client3.close()
await waitFor('gameEnded')
await new Promise( (resolve) => {setTimeout(resolve, 100)})
if(table.mode != 'lobby') {throw new Error('mode not lobby')}

console.log('New players joining!')

for(let i = 0; i < 3; i++) { new WebSocket(address) }
new WebSocket(address).on('message', (messageStr) => console.log(safeJsonParse(messageStr)) )
await new Promise( resolve => setTimeout(resolve, 100) )
connections.forEach( (conn, i) => {
	if(i > 3) table.addPlayer(uuidv4(), conn)
})
await new Promise( resolve => setTimeout(resolve, 100) )
if(table.mode != 'round') {throw new Error('mode not round')}
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
