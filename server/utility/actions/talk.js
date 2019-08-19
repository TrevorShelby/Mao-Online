const { sendEvent_ } = require('../sendMessage.js')



function talk_(game, playerID) {
	function talk(quote) {
		const playerIDs = []
		game.playerConnections.forEach( (_, playerID) => {
			playerIDs.push(playerID)
		})

		if(typeof quote != 'string' || quote.length > 200) { return }
		const chatData = {quote, by: playerID, timestamp: Date.now()}
		game.chatLog.push(chatData)

		sendEvent(game, playerIDs)('playerTalked', chatData)
	}
	return talk
}


module.exports = talk_