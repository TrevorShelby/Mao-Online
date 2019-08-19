const WebSocket = require('ws')

const { createNewGame, createPlayerActionPools } = require('../../utility/newGame.js')
const getSpokenCard = require('../../utility/spokenCard.js')
const safeJsonParse = require('../../utility/safeJsonParse.js')



let game
const players = []
const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	players.push(conn)
	if(players.length == 3) {
		const tableID = 0
		game = createNewGame(tableID, players)
		createPlayerActionPools(tableID)
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
}


const drawAction = {
	name: 'moveCard',
	args: {
		from: {source: 'deck'},
		to: {source: 'hand'}
	}
}
function getPlayAction(cardIndex) {
	const topCardIndex = game.round.piles[0].cards.length
	return {
		name: 'moveCard',
		args: {
			from: {source: 'hand', cardIndex},
			to: {source: 'pile', pileIndex: 0, cardIndex: topCardIndex}
		}
	}
}
function getTakeAction() {
	const topCardIndex = game.round.piles[0].cards.length - 1
	return {
		name: 'moveCard',
		args: {
			from: {source: 'pile', pileIndex: 0, cardIndex: topCardIndex},
			to: {source: 'hand'}
		}
	}
}

function doAction(seat, action) {
	const player = players[seat]
	player.emit('message', JSON.stringify({
		type: 'action',
		data: action
	}))
}


const clients = [
	new WebSocket('ws://127.0.0.1:1258?p=0'),
	new WebSocket('ws://127.0.0.1:1258?p=1'),
	new WebSocket('ws://127.0.0.1:1258?p=2')
]
clients[2].onopen = () => {
	clients[2].onmessage = (messageStr) => {
		const message = safeJsonParse(messageStr)
		const messageData = safeJsonParse(message.data)
		if(messageData.order >= 21) {
			console.log()
			console.log('seat 2')
			console.log(messageData)
		}
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
}
