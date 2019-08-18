const { playerConnections, messageHistories, playerIndexes } = require('./relationships.js')



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


function sendAck_(game, playerID) {
	function sendAck(ackUID, data=undefined) {
		const message = {type: 'ack', ackUID}
		if(data != undefined) { message.data = data }
		sendMessage_(game, playerID)(message)
	}
	return sendAck
}

function sendEvent_(game, playerID) {
	function sendEvent(name, data=undefined) {
		const message = {type: 'event', name}
		if(data != undefined) { message.data = data }

		game.playerConnections.forEach( (conn, otherPlayerID) => {
			if(otherPlayerID == playerID) { return }
			//this output of depr_sendMessage_ shouldn't be stored outside of sendEvent for optimiz-
			//-ation, due to the possibility that it could become outdated by the time it needs to
			//be used.
			sendMessage_(game, otherPlayerID)(message)
		})
	}
	return sendEvent
}



module.exports.sendMessage_ = sendMessage_
module.exports.sendAck_ = sendAck_
module.exports.sendEvent_ = sendEvent_