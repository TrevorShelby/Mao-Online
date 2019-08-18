const WebSocket = require('ws')

const { createNewGame, createPlayerActionPools } = require('../../utility/newGame.js')
const playerActionPools = require('../../utility/playerActionPools.js')
const getSpokenCard = require('../../utility/spokenCard.js')
const safeJsonParse = require('../../utility/safeJsonParse.js')



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
	console.log()
	console.log('hands:')
	console.log(spokenHands)
	console.log()
	console.log('piles:')
	console.log(spokenPiles)
}



const wsServer = new WebSocket.Server({port: 1258})

wsServer.on('connection', (conn, req) => {
	const playerID = parseInt(req.url[req.url.length - 1])
	conn.on('message', (messageStr) => {
		const message = safeJsonParse(messageStr)
		const isRepeatEvent = message.ackUID == undefined && playerID != 2
		const isAssumed = message.order < 21
		if(
			isRepeatEvent || isAssumed
		) { return }

		if(message.data.card != undefined) {
			message.data.card = getSpokenCard(message.data.card)
		}
		console.log()
		console.log('seat ' + playerID)
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
game.round.seating.forEach( (playerID, seat) => {
	if(playerID != undefined) {playerAckUIDCount.set(seat, 0)}
})

function getAckUID(seat) {
	const ackUID = playerAckUIDCount.get(seat)
	playerAckUIDCount.set(seat, ackUID + 1)
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
	const topCardIndex = game.round.piles[0].cards.length
	return {
		name: 'moveCard',
		data: {
			from: {source: 'hand', cardIndex},
			to: {source: 'pile', pileIndex: 0, cardIndex: topCardIndex}
		}
	}
}
function getTakeAction() {
	const topCardIndex = game.round.piles[0].cards.length - 1
	return {
		name: 'moveCard',
		data: {
			from: {source: 'pile', pileIndex: 0, cardIndex: topCardIndex},
			to: {source: 'hand'}
		}
	}
}


function doAction(seat, action) {
	const player = players[seat]
	const ackUID = getAckUID(seat)
	player.emit('message', JSON.stringify({
		type: 'action',
		ackUID,
		data: action
	}))
}



setTimeout( () => {

	for(let seat = 0; seat < 3; seat++) {
		for(let cardNum = 0; cardNum < 7; cardNum++) {
			doAction(seat, drawAction)
		}
	}
	printRound(game.round)

	doAction(0, getPlayAction(6))
	printRound(game.round)

	doAction(1, getTakeAction())
	printRound(game.round)

	doAction(1, drawAction)
	printRound(game.round)
}, 100)