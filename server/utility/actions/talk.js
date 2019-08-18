const { sendAck_, sendEvent_ } = require('../sendMessage.js')



function talk_(game, playerID) {
	const sendAck = sendAck_(game, playerID)
	const sendEvent = sendEvent_(game, playerID)
	function talk(ackUID, quote) {
		if(typeof quote != 'string' || quote.length > 200) { return }
		const chatData = {quote, by: playerID, timestamp: Date.now()}
		game.chatLog.push(chatData)
		sendAck(ackUID)
		sendEvent('playerTalked', chatData)
	}
	return talk
}


module.exports = talk_