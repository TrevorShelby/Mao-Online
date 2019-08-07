class Player {
	constructor(conn, listeners) {
		this.conn = conn
		this.listeners = listeners == undefined ? {} : listeners

		const messageListeners = conn.listeners('message')
		let listenerKey
		for(listenerKey in this.listeners) {
			const playerListener = this.listeners[listenerKey]
			if(!messageListeners.includes(playerListener)) {
				this.conn.on('message', playerListener)
			}
		}
	}


	addListener(eventName, playerListener) {
		if(this.listeners[eventName] != undefined) {
			throw Error(eventName + ' already has a listener.')
		}

		this.conn.on('message', playerListener)
		this.listeners[eventName] = playerListener
	}


	removeListener(eventName) {
		const playerListener = this.listeners[eventName]
		if(playerListener == undefined) {return}

		delete this.listeners[eventName]
		this.conn.off('message', playerListener)
		return playerListener
	}
}


module.exports = Player