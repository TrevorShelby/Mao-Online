const talk_ = require('./actions/talk.js')
const disconnect_ = require('./actions/disconnect.js')
const writeRule_ = require('./actions/writeRule.js')
const roundAction_ = require('./actions/roundAction.js')
const moveCard = require('./actions/moveCard.js')
const accuse = require('./actions/accuse.js')
const acceptAccusation = require('./actions/acceptAccusation.js')
const cancelAccusation = require('./actions/cancelAccusation.js')

const onActionMessage_ = require('./onActionMessage.js')
const sendEvent_ = require('./sendEvent.js')
const createNewGame = require('./newGame.js')
const sendRoundStartedEvent = require('./sendRoundStartedEvent.js')



function createNewTable(options) {
	const playerConnections = new Map()
	const eventHistories = new Map()
	const sendEvent = sendEvent_(playerConnections, eventHistories)

	const chatLog = []

	const mode = 'lobby'

	const game = undefined

	const table = {
		playerConnections,
		chatLog,
		mode,
		game,
		options,
		addPlayer(connection, playerID) {
			const connections = Array.from(table.playerConnections.values())
			if(connections.includes(connection)) { return false }
			if(typeof playerID != 'string') { return false }
			if(table.playerConnections.has(playerID)) { return false }
			if(table.mode != 'lobby') { return false }
			if(table.options.playersToStart == table.playerConnections.size) { return false }
			//others gets used later in function.
			const others = Array.from(table.playerConnections.keys())
			table.playerConnections.set(playerID, connection)
			eventHistories.set(playerID, [])
			const onActionMessage = onActionMessage_({
				talk:             talk_(table, sendEvent, playerID),

				writeRule:        writeRule_(table, sendEvent, playerID),

				moveCard:         roundAction_(moveCard, table, sendEvent, playerID),
				accuse:           roundAction_(accuse, table, sendEvent, playerID),
				acceptAccusation: roundAction_(acceptAccusation, table, sendEvent, playerID),
				cancelAccusation: roundAction_(cancelAccusation, table, sendEvent, playerID)
			})
			connection.on('message', onActionMessage)

			const disconnect = disconnect_(table, eventHistories, sendEvent, playerID)
			connection.on('close', disconnect)
			sendEvent([playerID], 'joinedTable', {you: playerID, others})
			if(table.options.playersToStart == table.playerConnections.size) {
				startGame(table, sendEvent)
			}
			return true
		}
	}


	return table
}



function startGame(table, sendEvent) {
	table.mode = 'game'
	//Passing sendEvent here is fine. startGame could just as well have used the createNewGame
	//code. It doesn't though, because that would make it a bit messier.
	table.game = createNewGame(table, sendEvent)
	sendEvent(table.game.playerIDs, 'gameStarted')
	sendRoundStartedEvent(table.game.round, sendEvent)
}



module.exports = createNewTable