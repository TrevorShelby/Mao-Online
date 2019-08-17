const EventEmitter = require('events')
const WebSocket = require('ws')

const createNewTable = require('./newTable.js')
const getSpokenCard = require('./spokenCard.js')
const safeJsonParse = require('./safeJsonParse.js')



function printRound(round) {
	const spokenHands = []
	round.hands.forEach( (hand) => {
		const spokenHand = []
		spokenHands.push(spokenHand)
		hand.forEach( (card) => {
			spokenHand.push(getSpokenCard(card))
		})
	})

	const spokenPiles = []
	round.piles.forEach( (pile) => {
		const spokenPile = []
		spokenPiles.push(spokenPile)
		pile.cards.forEach( (card) => {
			spokenPile.push(getSpokenCard(card))
		})
	})

	console.log()
	console.log('hands:')
	console.log(spokenHands)
	console.log()
	console.log('piles:')
	console.log(spokenPiles)
}



const wsServer = new WebSocket.Server({port: 1258})

wsServer.on('connection', (conn, req) => {
	const playerIndex = parseInt(req.url[req.url.length - 1])
	conn.on('message', (messageStr) => {
		const message = safeJsonParse(messageStr)
		if(message.ackUID != 7) { return }
		console.log()
		console.log(playerIndex)
		console.log(message)
	})
})


const players = [
	new WebSocket('ws://127.0.0.1:1258?p=1'),
	new WebSocket('ws://127.0.0.1:1258?p=2'),
	new WebSocket('ws://127.0.0.1:1258?p=3')
]
const round = createNewTable(0, players)


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


const drawAction = {
	name: 'moveCard',
	data: {
		from: {source: 'deck'},
		to: {source: 'hand'}
	}
}
function getPlayAction(cardIndex) {
	const topCardIndex = round.piles[0].cards.length
	return {
		name: 'moveCard',
		data: {
			from: {source: 'hand', cardIndex},
			to: {source: 'pile', pileIndex: 0, cardIndex: topCardIndex}
		}
	}
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
	for(let playerIndex = 0; playerIndex < 3; playerIndex++) {
		for(let cardNum = 0; cardNum < 7; cardNum++) {
			doAction(playerIndex, drawAction)
		}
	}
	printRound(round)

	doAction(0, getPlayAction(6))
	printRound(round)
}, 100)