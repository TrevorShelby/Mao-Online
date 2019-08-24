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



//This module is not to be used in production. Only to help with discovery and testing.

function createNewTable() {
	const playerConnections = new Map()
	const eventHistories = new Map()
	const sendEvent = sendEvent_(playerConnections, eventHistories)

	const chatLog = []

	const mode = 'lobby'

	const lobby = {
		playersToStart: 5
	}

	const game = undefined

	const table = {
		playerConnections,
		chatLog,
		mode,
		game,
		addPlayer(connection, playerID) {
			const connections = Array.from(table.playerConnections.values())
			if(connections.includes(connection)) { return false }
			if(typeof playerID != 'string') { return false }
			if(table.playerConnections.has(playerID)) { return false }
			if(table.mode != 'lobby') { return false }
			if(table.lobby.maxPlayers == table.playerConnections.size) { return false }

			table.playerConnections.set(playerID, connection)
			table.eventHistories.set(playerID, [])
			const onActionMessage = onActionMessage_({
				talk:             talk_(table, sendEvent, playerID),

				writeRule:        writeRule_(table, sendEvent, playerID),

				moveCard:         roundAction_(moveCard, table, sendEvent, playerID),
				accuse:           roundAction_(accuse, table, sendEvent, playerID),
				acceptAccusation: roundAction_(acceptAccusation, table, sendEvent, playerID),
				cancelAccusation: roundAction_(cancelAccusation, table, sendEvent, playerID)
			})
			connection.on('message', onActionMessage)

			const disconnect = disconnect_(table, sendEvent, playerID)
			connection.on('close', disconnect)
			sendEvent([playerID], 'joinedTable')
			if(lobby.playersToStart == table.playerConnections.size) {
				startGame(table, sendEvent)
			}
			return true
		}
	}


	return table
}



function startGame(table, sendEvent) {
	table.mode = 'game'
	//Passing sendEvent here is find. startGame could just as well have used the createNewGame
	//code. It doesn't though, because that would make it a bit messier.
	table.game = createNewGame(table.playerConnections, sendEvent)
	sendEvent(table.game.playerIDs, 'gameStarted')
	const discard = table.game.round.piles[0].cards
	table.game.round.seating.forEach( (playerID, seat) => {
		const hand = table.game.round.hands[seat]
		sendEvent([playerID], 'roundStarted', {
			you: {hand, seat}, discard, seating: table.game.round.seating
		})
	})
}



module.exports = createNewTable