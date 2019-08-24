const WebSocket = require('ws')


const clients = []
setTimeout( () => {
	const address = 'ws://192.168.137.107:1258'
	for(let i = 0; i < 3; i++) { clients.push(new WebSocket(address)) }

	clients[2].on('open', () => {
		clients[2].on('message', (messageStr) => {
			const message = safeJsonParse(messageStr)
			console.log(message)
		})
	})
}, 100)

setTimeout( () => {
	clients[1].close()
}, 5000)

setTimeout( () => {
	clients[0].close()
	clients[2].close()
}, 10000)



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