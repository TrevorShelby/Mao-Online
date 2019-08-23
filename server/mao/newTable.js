const uuidv4 = require('uuid')

const talk_ = require('./actions/talk.js')
const writeRule_ = require('./actions/writeRule.js')
const roundAction_ = require('./actions/roundAction.js')
const moveCard = require('./actions/moveCard.js')
const accuse = require('./actions/accuse.js')
const acceptAccusation = require('./actions/acceptAccusation.js')
const cancelAccusation = require('./actions/cancelAccusation.js')

const createNewGame = require('./newGame.js')
const onActionMessage_ = require('./onActionMessage.js')
const sendEvent_ = require('./sendEvent.js')



//This module is not to be used in production. Only to help with discovery and testing.

function createNewTable(connections) {
	const eventHistories = new Map()
	const playerConnections = new Map()
	connections.forEach( (conn) => {
		const playerID = uuidv4()
		eventHistories.set(playerID, [])
		playerConnections.set(playerID, conn)
	})
	const sendEvent = sendEvent_(playerConnections, eventHistories)


	const chatLog = []

	const mode = 'game'

	const game = createNewGame(playerConnections, sendEvent)


	const table = {
		playerConnections,
		chatLog,
		mode,
		game
	}

	table.playerConnections.forEach( (conn, playerID) => {
		//TODO: Add writeRule
		const onActionMessage = onActionMessage_({
			talk:             talk_(table, sendEvent, playerID),

			writeRule:        writeRule_(table, sendEvent, playerID),

			moveCard:         roundAction_(moveCard, table, sendEvent, playerID),
			accuse:           roundAction_(accuse, table, sendEvent, playerID),
			acceptAccusation: roundAction_(acceptAccusation, table, sendEvent, playerID),
			cancelAccusation: roundAction_(cancelAccusation, table, sendEvent, playerID)
		})
		conn.on('message', onActionMessage)
	})



	return table
}


module.exports = createNewTable