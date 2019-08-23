const uuidv4 = require('uuid')

const talk_ = require('./actions/talk.js')

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

	const mode = 'lobby'

	const game = undefined


	const table = {
		playerConnections,
		chatLog,
		mode,
		game
	}

	table.playerConnections.forEach( (conn, playerID) => {
		conn.on('message', onActionMessage_({
			talk: talk_(table, sendEvent, playerID)
		}))
	})

	return table
}


module.exports = createNewTable