const safeJsonParse = require('./safeJsonParse.js')


function onActionMessage_(actions) {
	function onActionMessage(messageStr) {
		const message = safeJsonParse(messageStr)
		if(typeof message != 'object') { return }

		if(message.type == 'action' && typeof message.name == 'string') {
			for(actionName in actions) {
				const action = actionName == message.name ? actions[actionName] : undefined
				if(action != undefined) {
					action(message.args)
					break
				}
			}
		}
	}

	return onActionMessage
}



module.exports = onActionMessage_