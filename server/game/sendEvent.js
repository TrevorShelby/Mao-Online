function sendEvent_(playerConnections, eventHistories) {
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