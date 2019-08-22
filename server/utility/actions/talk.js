const { sendEvent_ } = require('../sendMessage.js')



//TODO: Replace game with whatever will hold playerConnections.
function talk_(game, playerID) {
	function talk(quote) {
		const playerIDs = []
		game.playerConnections.forEach( (_, playerID) => {
			playerIDs.push(playerID)
		})

		if(typeof quote != 'string' || quote.length > 200) { return }
		const chatData = {quote, by: playerID, timestamp: Date.now()}
		game.chatLog.push(chatData)

		sendEvent_(game, playerIDs)('playerTalked', chatData)
	}
	return talk
}


module.exports = talk_