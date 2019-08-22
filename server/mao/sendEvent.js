function sendEvent_(playerConnections, messageHistories) {
	function sendEvent(playerIDs, name, data=undefined) {
		const message = {type: 'event', name}
		if(data != undefined) { message.data = data }

		playerIDs.forEach( (playerID) => {
			const conn = playerConnections.get(playerID)
			const messageHistory = messageHistories.get(playerID)
			const lastMessage = messageHistory[messageHistory.length - 1]
			const order = lastMessage != undefined ? lastMessage.order + 1: 0

			message.order = order
			conn.send(JSON.stringify(message))
			messageHistory.push(message)
		})
	}
	return sendEvent
}



module.exports= sendEvent_