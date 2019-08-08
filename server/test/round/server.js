//From server/test/server_template.js
//This template is for testing purposes only. More specific design should be given to any
//material that could see production.

const http = require('http')
const WebSocket = require('ws')

const safeJsonParse = require('../../utility/safeJsonParse.js')
const { draw, getNewRound }  = require('../../utility/round.js')
const Recipient = require('../../recipient.js')



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



function getCardMoveListener(round, conn) {
	function cardMoveListener(messageStr) {
		const message = safeJsonParse(messageStr)
		if(message == undefined || message.event != 'cardMove') { return }
		let cardIdentity
		if(message.from.type == 'hand') {
			if(typeof message.from.cardIndex != 'number') {return}
			const hand = round.hands.get(conn)
			if(message.from.cardIndex > 0 && message.from.cardIndex < hand.length) {
				cardIndentity = hand.splice(message.from.cardIndex, 1)
			}
			else { return }
		}
		else if(message.from.type == 'pile') {
			if(
				typeof message.from.cardIndex != 'number'
				|| typeof message.from.pileIndex != 'number'
			) { return }
			const pile = round.piles[message.from.pileIndex]
			if(pile == undefined) { return }
			if(message.from.cardIndex > 0 && message.from.cardIndex < round.length) {
				cardIdentity = pile.cards.splice(message.from.cardIndex, 1).indentity
			}
			else { return }
		}
		else if(message.from.type == 'deck') {
			cardIdentity = draw()
		}
		else { return }

		console.log(cardIdentity)
	}
	return cardMoveListener
}


function getPlayListeners(round, conn) {
	return {
		cardMoveListener: getCardMoveListener(round, conn)
	}
}



setTimeout(() => {
	const round = getNewRound(connections)

	connections.forEach( (conn) => {
		const player = new Recipient(conn, getPlayListeners(round, conn))
	})
}, 100)


server.listen(1258)