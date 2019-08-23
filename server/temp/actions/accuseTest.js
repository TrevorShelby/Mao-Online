const WebSocket = require('ws')

const { createNewGame, addGameActions } = require('../../mao/newGame.js')
const safeJsonParse = require('../../mao/safeJsonParse.js')


let game
let actionPools
const players = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	players.push(conn)
	if(players.length == 3) {
		const tableID = 0
		game = createNewGame(tableID, players)
		actionPools = addGameActions(game)
	}
})



function printAvailableActions() {
	console.log()
	console.log()
	actionPools.forEach( (actionPool, seat) => {
		console.log('seat ' + seat)
		console.log(actionPool)
	})
	console.log('--------------------')
}


function doAction(clientIndex, name, args) {
	const client = clients[clientIndex]
	client.send(JSON.stringify({
		type: 'action', name, args
	}))
}



const clients = [
	new WebSocket('ws://127.0.0.1:1258'),
	new WebSocket('ws://127.0.0.1:1258'),
	new WebSocket('ws://127.0.0.1:1258')
]
clients[2].onopen = async () => {
	clients[2].onmessage = (messageStr) => {
		const message = safeJsonParse(messageStr)
		const messageData = safeJsonParse(message.data)
		console.log()
		console.log('seat 2')
		console.log(messageData)
	}

	printAvailableActions()
	doAction(0, 'accuse', 1)
	await new Promise( (resolve) => {setTimeout(resolve, 100)} )
	printAvailableActions()
	doAction(1, 'acceptAccusation')
	await new Promise( (resolve) => {setTimeout(resolve, 100)} )
	printAvailableActions()
}