const uuidv4 = require('uuid')

const talk_ = require('./actions/talk.js')

const createNewGame = require('./newGame.js')
const onActionMessage_ = require('./onActionMessage.js')
const sendEvent_ = require('./sendEvent.js')



//This module is not to be used in production. Only to help with discovery and testing.

function createNewTable(connections) {
	const playerConnections = new Map()
	connections.forEach( (conn) => {
		playerConnections.set(uuidv4(), conn)
	})

	const chatLog = []

	const mode = 'game'

	const messageHistories = new Map()
	playerConnections.forEach( (_, playerID) => {
		messageHistories.set(playerID, [])
	})
	const sendEvent = sendEvent_(playerConnections, messageHistories)

	const game = createNewGame(sendEvent)


	const table = {
		playerConnections,
		chatLog,
		mode,
		game
	}

	table.playerConnections.forEach( (conn, playerID) => {
		conn.on('message', onActionMessage_({
			talk: talk_(game, sendEvent, playerID)
		}))
	})

	return table
}


module.exports = createNewTable