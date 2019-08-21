const WebSocket = require('ws')

const { createNewGame, createGameActionPools } = require('../utility/newGame.js')
const getSpokenCard = require('../utility/spokenCard.js')
const safeJsonParse = require('../utility/safeJsonParse.js')



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


function printAvailableActions() {
	actionPools.forEach( (actionPool, seat) => {
		console.log('seat ' + seat)
		console.log(actionPool.active)
	})
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


async function sleep(ms) {
	await new Promise( (resolve) => {setTimeout(resolve, ms)} )
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
		if(messageData.order < 7) { return }
		console.log()
		console.log('seat 0')
		console.log(messageData)
	}

	console.log('\n\nduring play')
	console.log(game.round.mode)
	printAvailableActions()
	for(let cardIndex = 6; cardIndex >= 0; cardIndex--) {
		doAction(0, 'moveCard', getPlayArgs(cardIndex))
	}
	await sleep(9000)
	console.log('\n\nduring last card played')
	console.log(game.round.mode)
	printAvailableActions()
	doAction(1, 'accuse', 2)
	await sleep(1500)
	console.log('\n\nduring lastChance accusation')
	console.log(game.round.mode)
	printAvailableActions()
	doAction(1, 'cancelAccusation')
	await sleep(100)
	console.log('\n\nafter lastChance accusation cancelled')
	console.log(game.round.mode)
	printAvailableActions()
	await sleep(1000)
	printAvailableActions()
}