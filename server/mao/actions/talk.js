const { sendEvent_ } = require('../sendMessage.js')



function talk_(table, playerID) {
	function talk(quote) {
		const playerIDs = []
		table.playerConnections.forEach( (_, playerID) => {
			playerIDs.push(playerID)
		})

		if(typeof quote != 'string' || quote.length > 200) { return }
		const chatData = {quote, by: playerID, timestamp: Date.now()}
		table.chatLog.push(chatData)

		sendEvent_(table, playerIDs)('playerTalked', chatData)
	}
	return talk
}


module.exports = talk_