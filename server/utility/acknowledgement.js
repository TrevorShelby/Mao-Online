const getConditionalListener = require('./conditionalListener.js')



function getOrder_(messageHistory) {
	function getOrder() {
		return messageHistory.length
	}
	return getOrder
}


function sendMessage_(conn, messageHistory) {
	function sendMessage(message) {
		messageHistory.push(message)
		conn.send(message)
	}
	return sendMessage
}



function isPing(obj) {
	//doesn't check for true uniqueness
	return obj.event == 'ping' && typeof obj.ackUUID == 'string'
}


function onPing_(sendMessage, getOrder) {
	function onPing({ackUUID}) {
		const pong = {event: 'pong', ackUUID, order: getOrder()}
		sendMessage(JSON.stringify(pong))
	}
	return onPing
}


function pingMessageListener_(conn, messageHistory) {
	return getConditionalListener(
		isPing,
		onPing_(sendMessage_(conn, messageHistory), getOrder_(messageHistory))
	)
}



module.exports.getOrder_ = getOrder_
module.exports.sendMessage_ = sendMessage_
module.exports.pingMessageListener_ = pingMessageListener_