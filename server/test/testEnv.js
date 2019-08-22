const WebSocket = require('ws')

const createNewTable = require('../mao/newTable.js')
const safeJsonParse = require('../mao/safeJsonParse.js')
const getSpokenCard = require('../mao/spokenCard.js')



let table
const players = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	players.push(conn)
	if(players.length == 3) {
		table = createNewTable(players)
	}
})



function printChatLog() {
	table.chatLog.forEach( (chat) => {
		const speakingSeat = table.game.round.seating.indexOf(chat.by)
		console.log('seat ' +  speakingSeat + ': ' + chat.quote)
	})
}


function printRound() {
	const spokenHands = []
	table.game.round.hands.forEach( (hand) => {
		const spokenHand = []
		spokenHands.push(spokenHand)
		hand.forEach( (card) => {
			spokenHand.push(getSpokenCard(card))
		})
	})

	const spokenPiles = []
	table.game.round.piles.forEach( (pile) => {
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
		if(detail == 'chatLog') {printChatLog()}
		else if(detail == 'round') {printRound()}
		else if(detail == 'mode') {console.log(table.game.round.mode)}
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

function moveCard(cardMovingSeat, from, to) {
	doAction(cardMovingSeat, 'moveCard', {from, to})
}

function drawCard(drawingSeat) {
	doAction(drawingSeat, 'moveCard', {
		from: {source: 'deck'}, to: {source: 'hand'}
	})
}

function playCard(playingSeat, cardIndex) {
	const discardTopCardIndex = table.game.round.piles[0].cards.length
	doAction(playingSeat, 'moveCard', {
		from: {source: 'hand', cardIndex},
		to: {source: 'pile', pileIndex: 0, cardIndex: discardTopCardIndex}
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

	//basic pattern: print, do action, wait, repeat.

	printDetails(['round'])
	await sleep()
	drawCard(0)
	printDetails(['round'])
}