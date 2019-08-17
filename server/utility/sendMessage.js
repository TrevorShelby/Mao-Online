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

module.exports = sendMessage_