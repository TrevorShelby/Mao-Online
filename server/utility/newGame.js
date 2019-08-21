const uuidv4 = require('uuid/v4')

const talk_ = require('./actions/talk.js')
const moveCard_ = require('./actions/moveCard.js')
const accuse_ = require('./actions/accuse.js')
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
function createGameActionPools(game) {
	const gameActionPools = []

	game.playerConnections.forEach( (conn, playerID) => {

		const playerActionPool = new ActionPool()

		const seat = game.round.seating.indexOf(playerID)
		playerActionPool.setAction(
			'talk', talk_(game, playerID),
			['play', 'accusation', 'lastChance', 'betweenRounds']
		)
		playerActionPool.setAction(
			'moveCard', moveCard_(game, playerID, endRound_(game, gameActionPools)),
			['play']
		)
		playerActionPool.setAction(
			'accuse', accuse_(game, gameActionPools, seat),
			['play', 'lastChance']
		)
		playerActionPool.setAction(
			'acceptAccusation', acceptAccusation_(game, gameActionPools),
			['accused']
		)
		playerActionPool.setAction(
			'cancelAccusation', cancelAccusation_(game, gameActionPools),
			['accuser']
		)
		playerActionPool.setAction(
			'writeRule', writeRule_(game, gameActionPools, playerID),
			['betweenRounds']
		)

		playerActionPool.activateByTag('play')
		conn.on('message', onMessage_(playerActionPool.active))
		gameActionPools.push(playerActionPool)
		playerActionPools.set(playerID, playerActionPool)
	})
	return gameActionPools
}



class ActionPool {
	constructor() {
		this.total = {}
		this.active = {}
		this.actionTags = {}
	}

	setAction(actionName, action, tags=[])  {
		this.total[actionName] = action
		this.actionTags[actionName] = tags
	}

	activate(actionName) {this.active[actionName] = this.total[actionName]}
	activateByTag(tag) {
		for(let actionName in this.total) {
			if(this.actionTags[actionName].includes(tag)) { this.activate(actionName) }
		}
	}


	deactivate(actionName) {delete this.active[actionName]}
	deactivateByTag(tag) {
		for(let actionName in this.total) {
			if(this.actionTags[actionName].includes(tag)) { this.deactivate(actionName) }
		}
	}


	changeActivityByTags(predicate) {
		for(let actionName in this.actionTags) {
			const activeFlag = predicate(this.actionTags[actionName])
			if(activeFlag == true) { this.activate(actionName) }
			else if(activeFlag == false) { this.deactivate(actionName) }
		}
	}
}



function onMessage_(activeActions) {
	function onMessage(messageStr) {
		const message = safeJsonParse(messageStr)
		if(typeof message != 'object') { return }

		if(message.type == 'action' && typeof message.name == 'string') {
			for(activeActionName in activeActions) {
				const action = activeActionName == message.name ? 
					activeActions[activeActionName] : undefined
				if(action != undefined) {
					action(message.args)
					break
				}
			}
		}
	}

	return onMessage
}



module.exports.createNewGame = createNewGame
module.exports.createGameActionPools = createGameActionPools
