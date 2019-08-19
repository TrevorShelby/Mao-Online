const WebSocket = require('ws')

const { createNewGame, createPlayerActionPools } = require('../../utility/newGame.js')
const safeJsonParse = require('../../utility/safeJsonParse.js')
const games = require('../../utility/games.js')



function printChatLog({chatLog, round: {seating}}) {
	console.log()
	chatLog.forEach( (chat) => {
		const speakingSeat = seating.indexOf(chat.by)
		const datetime = new Date(chat.timestamp)
		console.log('seat ' +  speakingSeat + ': ' + chat.quote)
	})
}


const wsServer = new WebSocket.Server({port: 1258})

wsServer.on('connection', (conn, req) => {
	const seat = parseInt(req.url[req.url.length - 1])
	conn.on('message', (messageStr) => {
		const message = safeJsonParse(messageStr)
		const isRepeatEvent = message.ackUID == undefined && seat != 2
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


const playerAckUIDCount = new Map()
//TODO: Fix. This is a lazy work-around for the actual way to do it (using relationships).
players.forEach( (_, playerIndex) => {
	playerAckUIDCount.set(playerIndex, 0)
})

function getAckUID(playerIndex) {
	const ackUID = playerAckUIDCount.get(playerIndex)
	playerAckUIDCount.set(playerIndex, ackUID + 1)
	return ackUID
}


function getTalkAction(quote) {
	return { name: 'talk', args: quote }
}

function doAction(playerIndex, action) {
	const player = players[playerIndex]
	const ackUID = getAckUID(playerIndex)
	player.emit('message', JSON.stringify({
		type: 'action',
		ackUID,
		data: action
	}))
}



setTimeout( () => {
	doAction(0, getTalkAction('hey everyone!'))
	doAction(1, getTalkAction('hello, how is it going?'))
	doAction(0, getTalkAction('it\'s going pretty good, thank you.'))
	printChatLog(game)
}, 100)