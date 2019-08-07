const EventEmitter = require('events')
const safeJsonParse = require('./utility/safeJsonParse.js')


//An abstraction layer over the connection message event layer for player connections.
class Player extends EventEmitter {
	constructor(conn) {
		super()
		this.conn = conn
		this.messageListeners = []
	}


	addMessageListener_(messageListener_) {
		const emit = Player.prototype.emit.bind(this)
		const messageListener = messageListener_(emit)
		this.conn.on('message', messageListener)
		this.messageListeners.push(messageListener)
		return messageListener
	}


	removeMessageListener(messageListener) {
		const index = this.messageListeners.indexOf(messageListener)
		const oldMessageListener = this.messageListeners.splice(index, 1)[0]
		this.conn.off('message', oldMessageListener)
	}
}


module.exports.Player = Player



function chatListener_(emit) {
	function chatListener(messageStr) {
		const message = safeJsonParse(messageStr)
		if(
			message == undefined || message.event != 'chatMessage'
			|| typeof message.quote != 'string'
			|| message.quote.length > 200
		) { return }
		emit('chatMessage', message.quote)
	}
	return chatListener
}



function startSignalListener_(emit) {
	function startSignalListener(messageStr) {
		const message = safeJsonParse(messageStr)
		if(message == undefined || message.event != 'startSignal') { return }
		emit('startSignal')
	}
	return startSignalListener
}



function playCardListener_(emit) {
	function playCardListener(messageStr) {
		const message = safeJsonParse(messageStr)
		if(
			message == undefined || message.event != 'playCard'
			|| typeof message.cardIndex != 'number' 
			|| message.cardIndex <= 0 || message.cardIndex >= 20
		) {
			return
		}
		emit('playCard', message.cardIndex)
	}
	return playCardListener
}



function messageListener(predicate, eventName, values) {
	function listener_(emit) {
		function listener(messageStr) {
			const message = safeJsonParse(messageStr)
			if(message == undefined || predicate(message) ) { return }
			const args = []
			values.forEach( (value) => {
				args.push(message[value])
			})
			emit(eventName, ...args)
		}
		return listener
	}
	return listener_
}


module.exports.playerEvents = Object.freeze({
	chatListener_, startSignalListener_
})