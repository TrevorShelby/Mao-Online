const WebSocket = require('ws')

const { createNewGame, createGameActionPools } = require('../../utility/newGame.js')
const safeJsonParse = require('../../utility/safeJsonParse.js')


//TODO: Find way to verify actionPools
let game
let actionPools
const players = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	players.push(conn)
	if(players.length == 3) {
		const tableID = 0
		game = createNewGame(tableID, players)
		actionPools = createGameActionPools(game)
	}
})



function printAvailableActions() {
	console.log()
	console.log()
	actionPools.forEach( (actionPool, seat) => {
		console.log('seat ' + seat)
		console.log(actionPool.active)
	})
}


function getAccuseAction(accusedSeat) {
	return { name: 'accuse', args: accusedSeat }
}

function doAction(playerIndex, action) {
	const player = players[playerIndex]
	player.emit('message', JSON.stringify({
		type: 'action',
		data: action
	}))
}



const clients = [
	new WebSocket('ws://127.0.0.1:1258'),
	new WebSocket('ws://127.0.0.1:1258'),
	new WebSocket('ws://127.0.0.1:1258')
]
clients[2].onopen = () => {
	clients[2].onmessage = (messageStr) => {
		const message = safeJsonParse(messageStr)
		const messageData = safeJsonParse(message.data)
		console.log()
		console.log('seat 2')
		console.log(messageData)
	}

	setTimeout( () => {
		printAvailableActions()
		doAction(0, getAccuseAction(1))
		printAvailableActions()
		doAction(1, {name: 'acceptAccusation'})
		printAvailableActions()
	}, 100)
}