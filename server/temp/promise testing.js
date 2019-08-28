const express = require('express')
const http = require('http')
const WebSocket = require('ws')


const app = express()
//Sends test page on index request.
app.get(
	'/',
	(req, res) => {res.sendFile(__dirname + '/pages/test.html')}
)

const server = http.createServer(app)

//Starts websocket server on server.
const wsServerOptions = {
	server: server
}
const wsServer = new WebSocket.Server(wsServerOptions)

wsServer.on(
	'connection',
	onWsServerConnect
)
function onWsServerConnect(conn, req) {
	conn.send(JSON.stringify({id: 0}))
	//Creates a promise that rejects if the server doesn't get a response from the client in the
	//next three seconds.
	const res =	new Promise( (resolve, reject) => {
		conn.on('message', message => {
			const data = JSON.parse(message)
			if(data.id == 0 && data.reply == 'admin1') {
				resolve(JSON.stringify({id: 1}))
			}
		})
		setTimeout( () => {
			reject({code: 4000, reason: 'No response given'})
		}, 3000)
	})
	//Replies to invalid password attempts.
	conn.on('message', message => {
		const data = JSON.parse(message)
		if(data.id == 0 && data.reply != 'admin1') {
			conn.send('Incorrect password')
		}
	})
	//Closes the connection if the promise is rejected.
	closeClient(conn, res)
}
/*
Closes client's websocket connection if the response is rejected.
conn {Websocket} - The client's websocket.
res {Promise} - Is resolved if the connection should stay open, and is rejected if the connection
should be closed.
*/
function closeRejectedClient(conn, res) {
	const returnIfAlreadyClosed = () => {if(conn.readyState == 2 || conn.readyState == 3) {return}}
	returnIfAlreadyClosed()
	res.then(
		(ackMessage) => {
			//sends back acknowledge message if there is one to send.
			if(ackMessage != undefined) {
				conn.send(ackMessage)
			}
		},
		(closeInfo) => {
			returnIfAlreadyClosed()
			if(closeInfo != undefined) {
				conn.close(closeInfo.code, closeInfo.reason)
			}
			else {
				conn.close()
			}
		}
	)
}


server.listen(1258)