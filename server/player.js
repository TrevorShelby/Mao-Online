class Player {
	constructor(conn, playerListeners) {
		this.conn = conn
		this.playerListeners = playerListeners

		const messageListeners = conn.listeners('message')
		for(listenerKey in this.playerListeners) {
			const playerListener = this.playerListeners[listenerKey]
			if(!messageListeners.includes(playerListener)) {
				this.conn.on('message', playerListener)
			}
		}
	}


	addListener(eventName, playerListener) {
		this.conn.on('message', playerListener)
		this.playerListeners[eventName] = playerListener
	}


	removeListener(eventName) {
		const playerListener = this.playerListeners[eventName]
		if(playerListener == undefined) {return}

		delete this.playerListeners[eventName]
		this.conn.off('message', playerListener)
		return playerListener
	}
}


module.exports = Player