const safeJsonParse = require('./safeJsonParse.js')
const actions = require('./actions.js')



function onMessage_(playerIndex) {
	function onMessage(messageStr) {
		const message = safeJsonParse(messageStr)
		if(typeof message != 'object') { return }

		if(message.type == 'action') {
			const { name, data } = message.data
			for(actionName in actions) {
				if(name == actionName) {
					const action = actions[actionName]
					action(playerIndex, message.ackUID, data)
					break
				}
			}
		}
	}


	return onMessage
}



module.exports = onMessage_