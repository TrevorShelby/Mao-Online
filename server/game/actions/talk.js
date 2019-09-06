//TODO: Fix! Needs playerIDs before game starts.
function talk_(table, talkerID) {
	function talk(quote) {
		if(typeof quote != 'string' || quote.length > 200) { return }
		const chatData = {quote, by: talkerID, timestamp: Date.now()}
		table.chatLog.push(chatData)

		table.sendEvent(table.playerIDs, 'playerTalked', chatData)
	}
	return talk
}



function talk_1(table, sendEvent, talkerID) {
	function talk(quote) {
		if(typeof quote != 'string' || quote.length > 200) { return }
		const chatData = {quote, by: talkerID, timestamp: Date.now()}
		table.chatLog.push(chatData)

		sendEvent(Array.from(table.playerConnections.keys()), 'playerTalked', chatData)
	}
	return talk
}


module.exports = talk_