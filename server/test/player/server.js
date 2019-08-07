//From server/test/server_template.js
//This template is for testing purposes only. More specific design should be given to any
//material that could see production.

const http = require('http')
const WebSocket = require('ws')

const safeJsonParse = require('../../utility/safeJsonParse.js')
const Player = require('../../player.js')



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



const greetings = ['hello', 'hey', 'howdy']
function getGreetingListener(conn) {
	function greetingListener(messageStr) {
		const message = safeJsonParse(messageStr)
		if(
			message == undefined || message.event != 'greeting'
			|| typeof message.greetingIndex != 'number'
			|| message.greetingIndex < 0 || message.greetingIndex > greetings.length
		) { return }
		const returnGreetingMessage = {
			event: 'greetingRecieved',
			greeting: greetings[message.greetingIndex]
		}
		conn.send(JSON.stringify(returnGreetingMessage))
	}
	return greetingListener
}

function getPlayerListeners(conn) {
	return {
		greeting: getGreetingListener(conn)
	}
}



const connections = []
const players = []
const onConnection = onConnection_({
	connections,
	callback: (conn) => {
		const player = new Player(conn, getPlayerListeners(conn))
		players.push(player)
	}
})

const server = http.createServer()

const wsServer = new WebSocket.Server({server})
wsServer.on('connection', onConnection)



server.listen(1258)