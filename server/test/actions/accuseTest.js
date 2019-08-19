const WebSocket = require('ws')

const { createNewGame, createPlayerActionPools } = require('../../utility/newGame.js')
const safeJsonParse = require('../../utility/safeJsonParse.js')


let game
let seatedActionPools
const players = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	players.push(conn)
	if(players.length == 3) {
		const tableID = 0
		game = createNewGame(tableID, players)
		seatedActionPools = createPlayerActionPools(tableID)
	}
})



function printAvailableActions() {
	console.log()
	console.log()
	seatedActionPools.forEach( (actionPool, seat) => {
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
		doAction(0, {name: 'cancelAccusation'})
		printAvailableActions()
	}, 100)
}