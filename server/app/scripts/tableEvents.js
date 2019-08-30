class TableEvents {
	constructor(tableConn) {
		this.listeners = {
			'joinedTable': [],
			'playerJoined': [],
			'playerLeft': [],
			'playerTalked': [],
			'gameStarted': [],
			'roundStarted': [],
			'cardMoved': [],
		}

		//TODO: Add order validation
		tableConn.onmessage = (messageEvent) => {
			const message = safeJsonParse(messageEvent.data)
			console.log(message)
			if(message.type != 'event' || !(message.name in this.listeners)) { return }
			this.listeners[message.name].forEach( listener => listener(message.data) )
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