function sendEvent_(connections, eventHistories) {
	function sendEvent(playerIDs, name, data=undefined) {
		playerIDs.forEach( recipientID => {
			const conn = connections.find( ([playerID]) => recipientID == playerID )
			const eventHistory = eventHistories.find( ([playerID]) => recipientID == playerID )
			const lastMessage = eventHistory[eventHistory.length - 1]
			const order = lastMessage != undefined ? lastMessage.order + 1 : 0

			const event = { type: 'event', name, order }
			if(data != undefined) { event.data = data }
			conn.send(JSON.stringify(event))
			eventHistory.push(event)
		})
	}
	return sendEvent
}


function sendEvent_1(playerConnections, eventHistories) {
	function sendEvent(playerIDs, name, data=undefined) {
		const message = {type: 'event', name}
		if(data != undefined) { message.data = data }

		playerIDs.forEach( (playerID) => {
			const messageCopy = Object.assign({}, message)
			const conn = playerConnections.get(playerID)
			const messageHistory = eventHistories.get(playerID)
			const lastMessage = messageHistory[messageHistory.length - 1]
			const order = lastMessage != undefined ? lastMessage.order + 1: 0

			//TODO: Rename to something other than messageCopy maybe.
			messageCopy.order = order
			conn.send(JSON.stringify(messageCopy))
			messageHistory.push(messageCopy)
		})
	}
	return sendEvent
}



module.exports = sendEvent_