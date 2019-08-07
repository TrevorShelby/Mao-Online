//From server/test/client_template.js
//This template is for testing purposes only. More specific design should be given to any
//material that could see production.

const WebSocket = require('ws')

const safeJsonParse = require('../utility/safeJsonParse.js')



//Credit to https://stackoverflow.com/a/1714899
//Returns a query string with the object encoded inside.
function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}



/*
 * Returns a WebSocket that's connected to the local server.
 *
 * @param {object} options
 * @param {number} options.port - The port that the WebSocket will be connected to.
 * @param {string} options.name - The name that gets used if the client needs to log activity.
 * @param {boolean} options.clientDoesLog - Whether or not the client any activity logs to the
 * console.
*/
function createClient({port, name='client', clientDoesLog=true, query=''}) {
	const client = new WebSocket('ws://localhost:' + port + '?' + query)
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



const port = 1258
const clients = [
	createClient({
		port,
		name: 'alpha',
		query: serialize({
			business: 'hosting',
			token: 'a'
		})
	}),
	createClient({
		port,
		name: 'red',
		query: serialize({
			business: 'joining',
			tableID: 0,
			token: 'r'
		})
	})
]
const alpha = clients[0]; const red = clients[1];

alpha.on('message', (messageStr) => {
	const message = safeJsonParse(messageStr)
	if(message.event == 'playerJoined') {
		const greetings = {
			event: 'chatMessage',
			quote: 'hello, ' + message.player.name
		}
		alpha.send(JSON.stringify(greetings))
	}
	if(message.event == 'chatMessage' && message.author != 'Alpha') {
		const affirmation = {
			event: 'chatMessage',
			quote: 'yea, give me a sec.'
		}
		alpha.send(JSON.stringify(affirmation))
		setTimeout(() => {
			const startSignal = {event: 'startSignal'}
			alpha.send(JSON.stringify(startSignal))
		}, 1000)
	}
})

//this is cheating, but whatever.
let heardAffirmation = false
red.on('message', (messageStr) => {
	const message = safeJsonParse(messageStr)
	if(
		message.event == 'chatMessage'
		&& message.author != 'Red'
		&& !heardAffirmation
	) {
		const greetings = {
			event: 'chatMessage',
			quote: 'hey! are we gonna start the game soon?'
		}
		red.send(JSON.stringify(greetings))
		heardAffirmation = true
	}
})