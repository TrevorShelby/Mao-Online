const { playerConnections, messageHistories } = require('./relationships.js')


function sendMessage_(round, playerIndex) {
	function sendMessage(message) {
		const conn = playerConnections.get(round).get(playerIndex)
		const messageHistory = messageHistories.get(round).get(playerIndex)
		const lastMessage = messageHistory[messageHistory.length - 1]
		const order = lastMessage != undefined ? lastMessage.order + 1 : 0

		message.order = order
		conn.send(JSON.stringify(message))
		messageHistory.push(message)
	}
	return sendMessage
}


function sendAck_(round, playerIndex) {
	function sendAck(ackUID, data) {
		const message = {type: 'ack', ackUID, data}
		sendMessage_(round, playerIndex)(message)
	}
	return sendAck
}

function sendEvent_(round, playerIndex) {
	function sendEvent(data) {
		const message = {type: 'event', name: 'cardMoved', data}
		playerIndexes.get(round).forEach( (otherPlayerIndex) => {
			if(playerIndex == otherPlayerIndex) { return }
			//this output of sendMessage_ shouldn't be stored outside of sendEvent for optimiz-
			//-ation, due to the possibility that it could become outdated by the time it needs to
			//be used.
			sendMessage_(round, otherPlayerIndex)(message)
		})
	}
	return sendEvent	
}


module.exports.sendMessage_ = sendMessage_
module.exports.sendAck_ = sendAck_
module.exports.sendEvent_ = sendEvent_