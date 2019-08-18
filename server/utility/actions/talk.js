const { sendAck_, sendEvent_ } = require('../sendMessage.js')
const { chatLogs } = require('../relationships.js')


function talk_(round, playerIndex) {
	const sendAck = sendAck_(round, playerIndex)
	const sendEvent = sendEvent_(round, playerIndex)
	const chatLog = chatLogs.get(round)
	function talk(ackUID, quote) {
		if(typeof quote != 'string' || quote.length > 200) { return }
		const chatData = {quote, by: playerIndex, timestamp: Date.now()}
		chatLog.push(chatData)
		sendAck(ackUID)
		sendEvent('playerTalked', chatData)
	}
	return talk
}


module.exports = talk_