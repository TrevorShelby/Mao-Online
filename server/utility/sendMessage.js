//BIG TODO: Get rid of acknowledgements. Acknowledgements were created because of the realization
//clients responsible for an action usually get different data that the clients that aren't. This
//might not always be the case however, making acknowledgements an arbitrary split. Everything
//should be done through events.


function sendMessage_(game, playerID) {
	function sendMessage(message) {
		const conn = game.playerConnections.get(playerID)
		const messageHistory = game.messageHistories.get(playerID)
		const lastMessage = messageHistory[messageHistory.length - 1]
		const order = lastMessage != undefined ? lastMessage.order + 1: 0

		message.order = order
		conn.send(JSON.stringify(message))
		messageHistory.push(message)
	}
	return sendMessage
}


function sendEvent_(game, playerIDs) {
	function sendEvent(name, data=undefined) {
		const message = {type: 'event', name}
		if(data != undefined) { message.data = data }
		playerIDs.forEach( (playerID) => {
			sendMessage_(game, playerID)(message)
		})
	}
	return sendAck
}


module.exports.sendMessage_ = sendMessage_
module.exports.sendEvent_ = sendEvent_