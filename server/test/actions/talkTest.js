const WebSocket = require('ws')

const { createNewGame, createGameActionPools } = require('../../utility/newGame.js')
const safeJsonParse = require('../../utility/safeJsonParse.js')



let game
const players = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	players.push(conn)
	if(players.length == 3) {
		const tableID = 0
		game = createNewGame(tableID, players)
		createGameActionPools(game)
	}
})



function printChatLog({chatLog, round: {seating}}) {
	console.log()
	chatLog.forEach( (chat) => {
		const speakingSeat = seating.indexOf(chat.by)
		console.log('seat ' +  speakingSeat + ': ' + chat.quote)
	})
}


function getTalkAction(quote) {
	return { name: 'talk', args: quote }
}

function doAction(clientIndex, action) {
	const client = clients[clientIndex]
	client.send(JSON.stringify({
		type: 'action',
		data: action
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

	doAction(0, getTalkAction('hey everyone!'))
	await new Promise( (resolve) => {setTimeout(resolve, 500)})
	doAction(1, getTalkAction('hello, how is it going?'))
	await new Promise( (resolve) => {setTimeout(resolve, 500)})
	doAction(0, getTalkAction('it\'s going pretty good, thank you.'))

	setTimeout( () => {
		printChatLog(game)
	}, 100)
}