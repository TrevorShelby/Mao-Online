const WebSocket = require('ws')

const { createNewGame, createGameActionPools } = require('../utility/newGame.js')
const getSpokenCard = require('../utility/spokenCard.js')
const safeJsonParse = require('../utility/safeJsonParse.js')



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
	console.log('--------------------')
}


function getPlayArgs(cardIndex) {
	const topCardIndex = game.round.piles[0].cards.length
	return {
		from: {source: 'hand', cardIndex},
		to: {source: 'pile', pileIndex: 0, cardIndex: topCardIndex}
	}
}

function doAction(clientIndex, name, args) {
	const client = clients[clientIndex]
	client.send(JSON.stringify({
		type: 'action', name, args
	}))
}


const clients = [
	new WebSocket('ws://127.0.0.1:1258?p=0'),
	new WebSocket('ws://127.0.0.1:1258?p=1'),
	new WebSocket('ws://127.0.0.1:1258?p=2')
]
clients[2].onopen = async () => {
	clients[0].onmessage = (messageStr) => {
		const message = safeJsonParse(messageStr)
		const messageData = safeJsonParse(message.data)
		console.log()
		console.log('seat 0')
		console.log(messageData)
	}

	printRound(game.round)
	for(let cardIndex = 6; cardIndex >= 0; cardIndex--) {
		doAction(0, 'moveCard', getPlayArgs(cardIndex))
	}
	await new Promise( (resolve) => {setTimeout(resolve, 100)} )
	printRound(game.round)
	doAction(0, 'writeRule', 'When someone plays a two card, it becomes their turn again.')
	await new Promise( (resolve) => {setTimeout(resolve, 100)} )
	printRound(game.round)
	console.log(game.rules)
}