const WebSocket = require('ws')

const { createNewGame, addGameActions } = require('../../mao/newGame.js')
const getSpokenCard = require('../../mao/spokenCard.js')
const safeJsonParse = require('../../mao/safeJsonParse.js')



let game
const players = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	players.push(conn)
	if(players.length == 3) {
		const tableID = 0
		game = createNewGame(tableID, players)
		addGameActions(game)
	}
})



function printRound() {
	const spokenHands = []
	game.round.hands.forEach( (hand) => {
		const spokenHand = []
		spokenHands.push(spokenHand)
		hand.forEach( (card) => {
			spokenHand.push(getSpokenCard(card))
		})
	})

	const spokenPiles = []
	game.round.piles.forEach( (pile) => {
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


const drawArgs = {
	from: {source: 'deck'},
	to: {source: 'hand'}
}
function getPlayArgs(cardIndex) {
	const topCardIndex = game.round.piles[0].cards.length
	return {
		from: {source: 'hand', cardIndex},
		to: {source: 'pile', pileIndex: 0, cardIndex: topCardIndex}
	}
}
function getTakeArgs() {
	const topCardIndex = game.round.piles[0].cards.length - 1
	return {
		from: {source: 'pile', pileIndex: 0, cardIndex: topCardIndex},
		to: {source: 'hand'}
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
	clients[2].onmessage = (messageStr) => {
		const message = safeJsonParse(messageStr)
		const messageData = safeJsonParse(message.data)
		console.log()
		console.log('seat 2')
		console.log(messageData)
	}


	printRound()
	doAction(0, 'moveCard', getPlayArgs(6))
	await new Promise( (resolve) => {setTimeout(resolve, 100)})
	printRound()
	doAction(1, 'moveCard', getTakeArgs())
	await new Promise( (resolve) => {setTimeout(resolve, 100)})
	printRound()
	doAction(1, 'moveCard', drawArgs)
	await new Promise( (resolve) => {setTimeout(resolve, 100)})
	printRound()
}