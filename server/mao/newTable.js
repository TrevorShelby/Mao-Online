const talk_ = require('./actions/talk.js')
const startGame_ = require('./actions/startGame.js')
const writeRule_ = require('./actions/writeRule.js')
const roundAction_ = require('./actions/roundAction.js')
const moveCard = require('./actions/moveCard.js')
const accuse = require('./actions/accuse.js')
const acceptAccusation = require('./actions/acceptAccusation.js')
const cancelAccusation = require('./actions/cancelAccusation.js')

const onActionMessage_ = require('./onActionMessage.js')
const sendEvent_ = require('./sendEvent.js')



//This module is not to be used in production. Only to help with discovery and testing.

function createNewTable(host, maxPlayers) {
	const playerConnections = new Map()
	const eventHistories = new Map()
	const sendEvent = sendEvent_(playerConnections, eventHistories)

	const chatLog = []

	const mode = 'lobby'

	const lobby = {
		maxPlayers
	}

	const game = undefined

	const hostID = host.playerID

	const table = {
		playerConnections,
		chatLog,
		mode,
		game,
		hostID,
		//TODO: Add logic for when the host leaves.
		addPlayer(connection, playerID) {
			const connections = Array.from(playerConnections.values())
			if(connections.includes(connection)) { return false }
			if(typeof playerID != 'string') { return false }
			if(playerConnections.has(playerID)) { return false }
			if(mode != 'lobby') { return false }
			if(lobby.maxPlayers == playerConnections.size) { return false }

			playerConnections.set(playerID, connection)
			eventHistories.set(playerID, [])
			const onActionMessage = onActionMessage_({
				talk:             talk_(table, sendEvent, playerID),

				startGame:        startGame_(table, sendEvent, playerID),

				writeRule:        writeRule_(table, sendEvent, playerID),

				moveCard:         roundAction_(moveCard, table, sendEvent, playerID),
				accuse:           roundAction_(accuse, table, sendEvent, playerID),
				acceptAccusation: roundAction_(acceptAccusation, table, sendEvent, playerID),
				cancelAccusation: roundAction_(cancelAccusation, table, sendEvent, playerID)
			})
			connection.on('message', onActionMessage)
			connection.on('close', () => {
				playerConnections.delete(playerID)
				eventHistories.delete(playerID)
			})
			return true
		}
	}
	table.addPlayer(host.connection, host.playerID)


	return table
}



module.exports = createNewTable