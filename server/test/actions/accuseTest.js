const WebSocket = require('ws')

const { createNewGame, createPlayerActionPools } = require('../../utility/newGame.js')
const safeJsonParse = require('../../utility/safeJsonParse.js')
const games = require('../../utility/games.js')
const playerActionPools = require('../../utility/playerActionPools')



const wsServer = new WebSocket.Server({port: 1258})

wsServer.on('connection', (conn, req) => {
	const seat = parseInt(req.url[req.url.length - 1])
	conn.on('message', (messageStr) => {
		const message = safeJsonParse(messageStr)
		const isRepeatEvent = seat != 0
		if(isRepeatEvent) { return }

		console.log()
		console.log('seat ' + seat)
		console.log(message)
	})
})


const tableID = 0
const players = [
	new WebSocket('ws://127.0.0.1:1258?p=0'),
	new WebSocket('ws://127.0.0.1:1258?p=1'),
	new WebSocket('ws://127.0.0.1:1258?p=2')
]
const game = createNewGame(tableID, players)
createPlayerActionPools(tableID)



function printAvailableActions() {
	const playerIDs = game.round.seating
	const seatedActionPools = playerIDs.map( (playerID) => {
		return playerActionPools.get(playerID).active
	})
	console.log()
	seatedActionPools.forEach( (actionPool) => {
		console.log(actionPool)
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



setTimeout( () => {
	printAvailableActions()
	doAction(0, getAccuseAction(1))
	printAvailableActions()
	doAction(1, {name: 'acceptAccusation'})
	printAvailableActions()
}, 100)