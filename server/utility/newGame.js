const uuidv4 = require('uuid/v4')

const games = require('./games.js')
const playerActionPools = require('./playerActionPools.js')
const talk_ = require('./actions/talk.js')
const moveCard_ = require('./actions/moveCard.js')
const safeJsonParse = require('./safeJsonParse.js')
const getPlayingCard = require('./playingCard.js')



//This code is not to be used in production. Only to help with discovery and testing.


function createNewGame(tableID, connections) {
	const playerConnections = new Map()
	//seating relates playerIDs to seats. The index of seating is the seat, and the element is the
	//playerID.
	const seating = []
	connections.forEach( (conn, seat) => {
		const playerID = uuidv4()
		playerConnections.set(playerID, conn)
		seating.push(playerID)
	})

	//DO NOT USE FILL! It makes each player's hand the same.
	const hands = []
	for(let i = 0; i < seating.length; i++) { hands.push([]) }
	const topCard = getPlayingCard(Math.floor(Math.random() * 52))
	const piles = [{owner: undefined, cards: [topCard]}]
	const accusation = undefined
	const round = { hands, piles, seating, accusation }

	const chatLog = []

	const messageHistories = new Map()
	seating.forEach( (playerID) => {
		messageHistories.set(playerID, [])
	})

	const game = {
		playerConnections,
		round,
		chatLog,
		messageHistories
	}
	games.set(tableID, game)

	return game
}


function createPlayerActionPools(tableID) {
	const game = games.get(tableID)
	game.playerConnections.forEach( (conn, playerID) => {
		const totalActionPool = {
			moveCard: moveCard_(game, playerID),
			talk: talk_(game, playerID)
		}
		const activeActionPool = {
			moveCard: totalActionPool.moveCard,
			talk: totalActionPool.talk
		}
		conn.on('message', onMessage_(activeActionPool))
		const playerActionPool = {
			total: totalActionPool,
			active: activeActionPool
		}
		playerActionPools.set(playerID, playerActionPool)
	})
}

function onMessage_(activeActionPool) {
	function onMessage(messageStr) {
		const message = safeJsonParse(messageStr)
		if(typeof message != 'object') { return }

		if(message.type == 'action' && typeof message.data == 'object') {
			const { name, args } = message.data
			for(actionName in activeActionPool) {
				const action = actionName == name ? activeActionPool[actionName] : undefined
				if(action != undefined) {
					action(args)
					break
				}
			}
		}
	}

	return onMessage
}



module.exports.createNewGame = createNewGame
module.exports.createPlayerActionPools = createPlayerActionPools