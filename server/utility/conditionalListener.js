const safeJsonParse = require('./safeJsonParse.js')


function getConditionalListener(predicate, callback) {
	function conditionalListener(messageStr) {
		const message = safeJsonParse(messageStr)
		if(message == undefined || !predicate(message)) { return }
		callback(message)
	}
	return conditionalListener
}