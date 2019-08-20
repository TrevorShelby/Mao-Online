const uuidv4 = require('uuid/v4')

const talk_ = require('./actions/talk.js')
const moveCard_ = require('./actions/moveCard.js')
const accuse_ = require('./actions/accuse.js')
const accuseWinner_ = require('./actions/accuseWinner.js')
const acceptAccusation_ = require('./actions/acceptAccusation.js')
const cancelAccusation_ = require('./actions/cancelAccusation.js')
const writeRule_ = require('./actions/writeRule.js')

const safeJsonParse = require('./safeJsonParse.js')
const getPlayingCard = require('./playingCard.js')
const getNewRound = require('./newRound.js')
const endRound_ = require('./endRound.js')



//This module is not to be used in production. Only to help with discovery and testing.
const games = new Map()
const playerActionPools = new Map()

//Sets up a game and seats connections into a round in play with some round 0 rules.
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

	const round = getNewRound(seating)

	const chatLog = []

	const rules = {
		starterRules: [
			{
				rule: 'When a spades card is played, the person who played it has to say the'
				+ ' card\'s suit and rank.',
				author: undefined
			},
			{
				rule: 'When an ace card is played, the order of player reverses.',
				author: undefined
			},
			{
				rule: 'When a jack card is played, a player can name the next suit that has to be'
				+ ' played.',
				author: undefined
			}
		],
		roundRules: []
	}

	const messageHistories = new Map()
	seating.forEach( (playerID) => {
		messageHistories.set(playerID, [])
	})

	const game = {
		playerConnections,
		round,
		chatLog,
		rules,
		messageHistories
	}
	games.set(tableID, game)

	return game
}



//There is an assumption that everyone at the table is seated for the round. It doesn't need
//fixing, since this is development code anyways, but I figure it should be noted so the same
//assumption doesn't carry over to an actual implementation.
function createPlayerActionPools(tableID) {
	const game = games.get(tableID)
	const roundActionPools = []

	game.playerConnections.forEach( (conn, playerID) => {

		const playerActionPool = new ActionPool()

		const seat = game.round.seating.indexOf(playerID)
		//TODO: Fix arguments, add tags.
		playerActionPool.setAction(
			'talk', talk_(game, playerID),
			['always']
		)
		playerActionPool.setAction(
			'moveCard', moveCard_(game, playerID, endRound_(game, roundActionPools)),
			['play']
		)
		playerActionPool.setAction(
			'accuse', accuse_(game, roundActionPools, seat),
			['play', 'lastChance']
		)
		playerActionPool.setAction(
			'acceptAccusation', acceptAccusation_(game, roundActionPools, seat),
			['accusation']
		)
		playerActionPool.setAction(
			'cancelAccusation', cancelAccusation_(game, roundActionPools, seat),
			['accusation']
		)
		playerActionPool.setAction(
			'writeRule', writeRule_(game, roundActionPools, playerID),
			['betweenRounds']
		)

		conn.on('message', onMessage_(playerActionPool.active))
		roundActionPools.push(playerActionPool)
		playerActionPools.set(playerID, playerActionPool)
	})

	return roundActionPools
}



class ActionPool {
	constructor() {
		this.total = {}
		this.active = {}
		this.tag = {}
	}

	setAction(actionName, action, tags=[])  {
		this.total[actionName] = action
		tags.forEach( (tag) => {
			if(!(tag in tags)) {this.tags[tag] = []}
			this.tags[tag].push(actionName)
		})
	}

	activate(actionName) {this.active[actionName] = this.total[actionName]}
	activateByTag(tag) {
		this.tags[tag].forEach( ActionPool.prototype.activate.bind(this) )
	}

	deactivate(actionName) {delete this.active[actionName]}
	deactivateByTag(tag) {
		this.tags[tag].forEach( ActionPool.prototype.deactivate.bind(this) )
	}
}



function onMessage_(activeActions) {
	function onMessage(messageStr) {
		const message = safeJsonParse(messageStr)
		if(typeof message != 'object') { return }

		if(message.type == 'action' && typeof message.data == 'object') {
			const { name, args } = message.data
			for(actionName in activeActions) {
				const action = actionName == name ? activeActions[actionName] : undefined
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
