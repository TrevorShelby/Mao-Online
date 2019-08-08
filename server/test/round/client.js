//From server/test/client_template.js
//This template is for testing purposes only. More specific design should be given to any
//material that could see production.

const WebSocket = require('ws')

const safeJsonParse = require('../../utility/safeJsonParse.js')



/*
 * Returns a WebSocket that's connected to the local server.
 *
 * @param {object} options
 * @param {number} options.port - The port that the WebSocket will be connected to.
 * @param {string} options.name - The name that gets used if the client needs to log activity.
 * @param {boolean} options.clientDoesLog - Whether or not the client any activity logs to the
 * console.
*/
function createClient({port, name='client', clientDoesLog=true}) {
	const client = new WebSocket('ws://localhost:' + port)
	if(!clientDoesLog) {return client}


	client.on('open', () => {
		console.log(name + ': connection opened')
	})

	client.on('message', (messageStr) => {
		const message = safeJsonParse(messageStr)
		console.log(name + ': message received')
		console.log(message)
	})

	client.on('close', (_, reason) => {
		if(reason != undefined) {
			console.log(name + ': connection closed because ' + reason)
		}
		else {
			console.log(name + ': connection closed')
		}
	})


	return client
}



const clients = []
const options = {port: 1258}
for(let i = 0; i < 5; i++) {
	clients.push(createClient(options))
}

setTimeout(()=>{
	clients[4].send(JSON.stringify({
		event: 'cardMove', from: {type: 'pile', pileIndex: 0, cardIndex: 0}
	}))
}, 200)