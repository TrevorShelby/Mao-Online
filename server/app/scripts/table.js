class TableEvents {
	constructor(tableConn) {
		this.listeners = {
			'tableJoined': [],
			'gameStarted': [],
			'roundStarted': [],
			'cardMoved': [],
		}
	}

	on(eventName, listener) {
		this.listeners[eventName].push(listener)
	}

	off(eventName, listener) {
		const listenerIndex = this.listeners[eventName].indexOf(listener)
		this.listeners[eventName].splice(listenerIndex, 1)
	}
}