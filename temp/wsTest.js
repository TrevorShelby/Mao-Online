const WebSocket = require('ws')

const { createNewGame, createPlayerActionPools } = require('../../utility/newGame.js')
const safeJsonParse = require('../../utility/safeJsonParse.js')


//Removed games.js and playerActionPools.js, added acceptAccusation action, and changed chat log
//test to run over network

const wsServer = new WebSocket.Server({port: 1258})

wsServer.on('connection', (conn, req) => {
	const tableID = 0
	const game = createNewGame(tableID, [conn])
	createPlayerActionPools(tableID)
})



const player = new WebSocket('ws://127.0.0.1:1258')


player.onopen = () => {
	player.send(JSON.stringify({
		type: 'action',
		data: {
			name: 'talk', args: 'hello'
		}
	}))
	player.onmessage = (messageStr) => {
		console.log(safeJsonParse(messageStr.data))
	}
}