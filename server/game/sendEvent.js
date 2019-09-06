function sendEvent_(connections, eventHistories) {
	function sendEvent(playerIDs, name, data=undefined) {
		playerIDs.forEach( recipientID => {
			const conn = connections.find( ([playerID]=[undefined]) => recipientID == playerID )[1]
			const eventHistory = eventHistories[recipientID]
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



module.exports = sendEvent_