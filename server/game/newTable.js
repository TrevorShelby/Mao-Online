const talk_ = require('./actions/talk.js')
const disconnect_ = require('./actions/disconnect.js')
const writeRule_ = require('./actions/writeRule.js')
const moveCard_ = require('./actions/moveCard.js')
const accuse_ = require('./actions/accuse.js')
const acceptAccusation_ = require('./actions/acceptAccusation.js')
const cancelAccusation_ = require('./actions/cancelAccusation.js')

const onActionMessage_ = require('./onActionMessage.js')
const sendEvent_ = require('./sendEvent.js')
const startNewGame = require('./newGame.js')



function createNewTable(options) {
	const table = {}
	table.connections = []
	table.playerIDs = []
	table.mode = 'lobby'
	table.chatLog = []
	table.options = Object.assign({}, options)

	const eventHistories = {}
	table.sendEvent = sendEvent_(table.connections, eventHistories)
	table.addPlayer = (function addPlayer(joiningPlayerID, joiningConn) {
		if(this.mode != 'lobby') return false
		if(typeof joiningPlayerID != 'string') return false
		if(
			this.connections.some( ([playerID,conn]) => {
				return conn == joiningConn || playerID == joiningPlayerID
			})
		) return false

		const others = this.connections.map( ([playerID]) => playerID )
		this.connections.push([joiningPlayerID, joiningConn])
		this.playerIDs.push(joiningPlayerID)
		eventHistories[joiningPlayerID] = []
		const onActionMessage = onActionMessage_({
			talk:             talk_(this, joiningPlayerID),

			writeRule:        writeRule_(this, joiningPlayerID),

			moveCard:         moveCard_(this, joiningPlayerID),
			accuse:           accuse_(this, joiningPlayerID),
			acceptAccusation: acceptAccusation_(this, joiningPlayerID),
			cancelAccusation: cancelAccusation_(this, joiningPlayerID)
		})
		joiningConn.on('message', onActionMessage)

		const disconnect = disconnect_(this, eventHistories, joiningPlayerID)
		joiningConn.on('close', disconnect)
		this.sendEvent([joiningPlayerID], 'joinedTable', {you: joiningPlayerID, others})
		this.sendEvent(others, 'playerJoined', joiningPlayerID)
		if(this.options.playersToStart == this.connections.length) {
			this.mode = 'round'
			startNewGame(this)
		}
		return true
	}).bind(table)

	return table
}



module.exports = createNewTable