function talk_(table, talkerID) {
	function talk(quote) {
		if(typeof quote != 'string' || quote.length > 200) return
		const chatData = {quote, by: talkerID, timestamp: Date.now()}
		table.chatLog.push(chatData)

		table.sendEvent(table.playerIDs, 'playerTalked', chatData)
	}
	return talk
}


module.exports = talk_