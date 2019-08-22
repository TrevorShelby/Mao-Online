const uuidv4 = require('uuid')

const talk_ = require('./actions/talk.js')

const createNewGame = require('./newGame.js')
const onActionMessage_ = require('./onActionMessage.js')



//This module is not to be used in production. Only to help with discovery and testing.

function createNewTable(connections) {
	const playerConnections = new Map()
	connections.forEach( (conn) => {
		playerConnections.set(uuidv4(), conn)
	})

	const chatLog = []

	const mode = 'game'

	const playerIDs = Array.from(playerConnections.values())
	const game = createNewGame(playerIDs, playerConnections)


	const table = {
		playerConnections,
		chatLog,
		mode,
		game
	}

	table.playerConnections.forEach( (conn, playerID) => {
		conn.on('message', onActionMessage_({
			talk: talk_(game, playerID)
		}))
	})

	return table
}


module.exports = createNewTable