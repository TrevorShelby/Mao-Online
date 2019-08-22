const WebSocket = require('ws')

const { createNewGame, createGameActionPools } = require('../utility/newGame.js')
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



function printChatLog() {
	game.chatLog.forEach( (chat) => {
		const speakingSeat = game.round.seating.indexOf(chat.by)
		console.log('seat ' +  speakingSeat + ': ' + chat.quote)
	})
}


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

	console.log('hands:')
	console.log(spokenHands)
	console.log()
	console.log('piles:')
	console.log(spokenPiles)
}


function printDivider() {console.log('--------------------')}

function printDetails(details) {
	console.log()
	details.forEach( (detail) => {
		console.log()
		if(detail == 'availableActions') {printAvailableActions()}
		else if(detail == 'round') {printRound()}
		else if(detail == 'mode') {console.log(game.round.mode)}
	})
	printDivider()
}



function doAction(seatIndex, name, args) {
	const client = clients[seatIndex]
	client.send(JSON.stringify({
		type: 'action', name, args
	}))
}


function talk(talkingSeat, quote) {
	doAction(talkingSeat, 'talk', quote)
}

function moveCard(playingSeat, from, to) {
	doAction(playingSeat, 'moveCard', {from, to})
}

function playCard(playingSeat, cardIndex) {
	const discardTopCardIndex = game.round.piles[0].cards.length
	doAction(playingSeat, 'moveCard', {
		from: {source: 'hand', cardIndex},
		to: {source: 'pile', playingSeat}
	})
}

function accuse(accusingSeat, accusedSeat) {
	doAction(accusingSeat, 'accuse', accusedSeat)
}

function acceptAccusation(accusedSeat) {
	doAction(accusedSeat, 'acceptAccusation')
}

function cancelAccusation(accusingSeat) {
	doAction(accusingSeat, 'cancelAccusation')
}



async function sleep(ms=100) {
	await new Promise( (resolve) => {setTimeout(resolve, ms)} )
}

const clients = [
	new WebSocket('ws://127.0.0.1:1258'),
	new WebSocket('ws://127.0.0.1:1258'),
	new WebSocket('ws://127.0.0.1:1258')
]
clients[2].onopen = async () => {
	const relayingSeat = 2
	clients[relayingSeat].onmessage = (messageStr) => {
		const message = safeJsonParse(messageStr)
		const messageData = safeJsonParse(message.data)
		console.log()
		console.log('event (from seat ' + relayingSeat + '):')
		console.log(messageData)
	}

	//basic pattern: print, do action, wait (for game to update on action), repeat.
	printDetails(['mode'])
	accuse(0, 1)
	await sleep()
	printDetails(['mode'])
	acceptAccusation(1)
	await sleep()
	printDetails(['mode'])
}