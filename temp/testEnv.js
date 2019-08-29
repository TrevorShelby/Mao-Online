const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const createNewTable = require('../mao/newTable.js')
const getSpokenCard = require('./spokenCard.js')



const table = createNewTable(3)
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	table.addPlayer(conn, uuidv4())
})



function printChatLog() {
	table.chatLog.forEach( (chat) => {
		console.log('player ' +  chat.by + ': ' + chat.quote)
	})
	console.log('--------------------')
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
	console.log('--------------------')
}


function printMode() {
	console.log(table.game.round.mode)
	console.log('--------------------')
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

function takeCard(takingSeat) {
	const discardTopCardIndex = table.game.round.piles[0].cards.length - 1
	doAction(takingSeat, 'moveCard', {
		from: {source: 'pile', pileIndex: 0, cardIndex: discardTopCardIndex},
		to: {source: 'hand'}
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



//basic pattern: assert, do action, wait, repeat.

async function testTalk({chatLog, playerConnections}) {
	if(chatLog.length > 0) {
		throw new Error('Non-empty chatLog before any chat.')
	}

	const quotes = ['hello world', 'hey there. how are you?', 'good. thanks for asking.']
	talk(0, quotes[0])
	await sleep()
	assertChat(chatLog, playerConnections, 0, quotes[0], clients[0])
	talk(1, quotes[1])
	await sleep()
	assertChat(chatLog, playerConnections, 1, quotes[1], clients[1])
	talk(0, quotes[2])
	await sleep()
	assertChat(chatLog, playerConnections, 2, quotes[2], clients[0])
}

function assertChat(chatLog, playerConnections, expectedIndex, expectedQuote, expectedConnection) {
	if(!(expectedIndex in chatLog)) {
		throw new Error('message not added.')
	}
	const chatMessage = chatLog[expectedIndex]
	if(chatMessage.quote != expectedQuote) {
		throw new Error('quote for message does not match.')
	}
	const matchedConnection = playerConnections.get(chatMessage.by)
	if(expectedConnection == matchedConnection) {
		throw new Error('message misattributed.')
	}
}



async function testMoveCard() {
	printRound()
	playCard(0, 6)
	await sleep()
	printRound()
	takeCard(1)
	await sleep()
	printRound()
	drawCard(1)
	await sleep()
	printRound()
}



async function testAccuse({game: {round}}) {
	assertPlay(round)
	accuse(0, 1)
	await sleep()
	assertAccusation(round, 0, 1)
	accuse(1, 2)
	acceptAccusation(0)
	cancelAccusation(1)
	await sleep()
	assertAccusation(round, 0, 1)
	acceptAccusation(1)
	await sleep()
	assertPlay(round)
	accuse(0, 1)
	cancelAccusation(0)
	await sleep()
	assertPlay(round)
}

function assertMode(round, expectedMode) {
	if(round.mode != expectedMode) {
		throw new Error('mode does not match.')
	}
}

function assertPlay(round) {
	assertMode(round, 'play')
	if(round.accusation != undefined) {
		throw new Error('accusation still exists during play.')
	}
}

function assertAccusation(round, expectedAccuser, expectedAccused) {
	assertMode(round, 'accusation')
	if(round.accusation.accuser != expectedAccuser) {
		throw new Error('accuser does not match.')
	}
	if(round.accusation.accused != expectedAccused) {
		throw new Error('accused does not match.')
	}
}


async function testLastChance({game: {round}, game}) {
	if(round.hands[0].length != 7) { throw new Error('wrong number of starting cards.')}
	for(let i = 0; i < 7; i++) { playCard(0, 0) }
	await sleep()
	if(round.mode != 'lastChance') { throw new Error('mode is not lastChance.') }
	accuse(0, 1)
	playCard(1)
	await sleep()
	if(round.mode != 'lastChance') { throw new Error('mode is not lastChance.') }
	if(round.hands[1].length != 7) { throw new Error('card played during lastChance.') }
	accuse(1, 0)
	await sleep()
	if(round.mode != 'accusation') { throw new Error('mode is not accusation.') }
	await sleep(3000)
	if(game.inBetweenRounds) { throw new Error('timer did not stop in accusation.') }
	cancelAccusation(1)
	await sleep()
	if(round.mode != 'lastChance') { throw new Error('mode is not lastChance.') }
	accuse(1, 0)
	acceptAccusation(0)
	if(round.mode != 'play') { throw new Error('mode is not play.') }
	drawCard(0)
	playCard(0, 0)
	if(round.mode != 'lastChance') { throw new Error('mode is not lastChance.') }
	await(3000)
	if(!game.inBetweenRounds) { throw new Error('round did not end.') }
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
		console.log('event (from seat ' + relayingSeat + '):')
		console.log(messageData)
		console.log()
	}

	await sleep(1000)

	await testLastChance(table)
	console.log('test complete')
}



function safeJsonParse(objStr) {
	let obj
	try {
		obj = JSON.parse(objStr)
	}
	catch(err) {
		obj = objStr
	}
	return obj
}