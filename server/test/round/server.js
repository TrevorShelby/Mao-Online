//From server/test/server_template.js
//This template is for testing purposes only. More specific design should be given to any
//material that could see production.

const http = require('http')
const WebSocket = require('ws')

const safeJsonParse = require('../../utility/safeJsonParse.js')
const { draw, getNewRound }  = require('../../utility/round.js')
const Recipient = require('../../recipient.js')
const { getSpokenCard, printRound } = require('./printUtil.js')
const getConditionalListener = require('../../utility/conditionalListener.js')



/*
 * A second order function that returns an event listener for a websocket server that listens for
 * new connections, tracks them, possibly logs their activity, and can use them in any other way.
 *
 * @param {object} options
 * @param {WebSocket[]} options.connections - A list of connections to the server. The new conn-
 * -ection gets added, and, once it closes, it gets removed.
 * @param {boolean} options.serverDoesLogging - Whether or not the server logs any messages it
 * receives to the console.
 * @param {Function} options.callback - Takes in the new connection for any other use.
*/
function onConnection_({connections, serverDoesLogging=true, callback=()=>{}}) {
	//The event listener.
	function onConnection(conn) {
		connections.push(conn)
		conn.on('close', () => {
			const connIndex = connections.indexOf(conn)
			connections.splice(connIndex, 1)
		})

		if(serverDoesLogging) {
			conn.on('message', (messageStr) => {
				const message = safeJsonParse(messageStr)
				console.log('server: message received')
				console.log(message)
			})
		}

		callback(conn)
	}
	return onConnection
}



const connections = []
const onConnection = onConnection_({
	connections,
	callback: ()=>{}
})

const server = http.createServer()

const wsServer = new WebSocket.Server({server})
wsServer.on('connection', onConnection)



function isCardMove(message) {
	return (
		message.event == 'cardMove'
		&& message.from != undefined && message.to != undefined
	)
}


function getCardMoveListener(round, conn) {
	function cardMoveListener(message) {
		let movedCardIdentity
		if(message.from.type == 'hand') {
			if(message.to.type == 'hand') { return }
			if(typeof message.from.cardIndex != 'number') { return }
			const hand = round.hands.get(conn)
			if(message.from.cardIndex >= 0 && message.from.cardIndex < hand.length) {
				movedCardIdentity = hand.splice(message.from.cardIndex, 1)[0]
			}
			//TODO: Maybe send a message back to connection if cardIndex is off.
			else { return }
		}
		else if(message.from.type == 'pile') {
			if(
				typeof message.from.cardIndex != 'number'
				|| typeof message.from.pileIndex != 'number'
			) { return }
			if(
				message.to.type == 'pile' && message.to.pileIndex == message.from.pileIndex
			) { return }
			const pile = round.piles[message.from.pileIndex]
			if(pile == undefined) { return }
			if(message.from.cardIndex >= 0 && message.from.cardIndex < pile.cards.length) {
				movedCardIdentity = pile.cards.splice(message.from.cardIndex, 1)[0].identity
			}
			//TODO: Maybe send a message back to connection if cardIndex is off.
			else { return }
		}
		else if(message.from.type == 'deck') {
			//TODO: Maybe remove, as this limitation restricts card-burning, and functionality to
			//view moved cards, even after being put away, might be added.
			if(message.to.type == 'deck') { return }
			movedCardIdentity = draw()
		}
		else { return }
		console.log(getSpokenCard(movedCardIdentity))

		//IMPORTANT!!!
		//TODO: Make sure that faulty 'to' object won't get rid of the card being moved like the
		//code currently does. May require adding logic to predicate.
		if(message.to.type == 'hand') {
			const hand = round.hands.get(conn)
			hand.push(movedCardIdentity)
		}
		else if(message.to.type == 'pile') {
			if(typeof message.from.pileIndex != 'number') { return }
		}
		else { return }

		printRound(round)
	}
	return getConditionalListener(isCardMove, cardMoveListener)
}


function getPlayListeners(round, conn) {
	return {
		cardMoveListener: getCardMoveListener(round, conn)
	}
}



setTimeout(() => {
	const round = getNewRound(connections)
	printRound(round)

	connections.forEach( (conn) => {
		const player = new Recipient(conn, getPlayListeners(round, conn))
	})
}, 100)


server.listen(1258)