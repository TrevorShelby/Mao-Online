class WebSocketEventEmitter {
	constructor(conn) {
		this.conn = conn
		this.listeners = {
			'open': [],
			'message': [],
			'error': [],
			'close': []
		}
		this.conn.onopen = e => this.listeners['open'].forEach( listener => listener(e) )
		this.conn.onmessage = e => this.listeners['message'].forEach( listener => listener(e) )
		this.conn.onerror = e => this.listeners['error'].forEach( listener => listener(e) )
		this.conn.onclose = e => this.listeners['close'].forEach( listener => listener(e) )
	}

	on(eventName, listener) {
		if(!(eventName in this.listeners)) return
		this.listeners[eventName].push(listener)
	}

	off(eventName, listener) {
		if(!(eventName in this.listeners)) return
		const listenerIndex = this.listeners[eventName].indexOf(listener)
		if(listenerIndex < 0) return
		this.listeners[eventName].splice(listenerIndex, 1)
	}

	send(message) { this.conn.send(message) }
}

const port = 8080
const address = '192.168.137.111'
const createSocket = (tableID, name) => new WebSocketEventEmitter(
	new WebSocket('ws://' + address + ':' + port + '?tableID=' + tableID + '&name=' + name)
)

//red, dark blue, green, gold, light blue, orange, purple, grey
const seatColors = [
	'#dc3823', '#2323C7', '#50a332', '#f6b709', '#d02f7c', '#fc7f03', '#33b4cc', '#818181'
]

module.exports = {
	port, address, createSocket, seatColors
}