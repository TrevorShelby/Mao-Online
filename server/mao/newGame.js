const moveCard_ = require('./actions/moveCard.js')
const accuse_ = require('./actions/accuse.js')
const acceptAccusation_ = require('./actions/acceptAccusation.js')
const cancelAccusation_ = require('./actions/cancelAccusation.js')
const writeRule_ = require('./actions/writeRule.js')

const getNewRound = require('./newRound.js')
const onActionMessage_ = require('./onActionMessage.js')



//This module is not to be used in production. Only to help with discovery and testing.


//Sets up a game and seats connections into a round in play with some round 0 rules.
function createNewGame(sendEvent) {
	const playerIDs = Array.from(playerConnections.keys())
	const round = getNewRound(playerIDs)

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

	const inBetweenRounds = false

	const game = {
		round,
		rules,
		inBetweenRounds
	}
	addGameActions(game, sendEvent)
	return game
}



//There is an assumption that everyone at the table is seated for the round. It doesn't need
//fixing, since this is development code anyways, but I figure it should be noted so the same
//assumption doesn't carry over to an actual implementation.
function addGameActions(game, playerConnections, sendEvent) {
	playerConnections.forEach( (conn, playerID) => {
		const playerSeat = game.round.seating.indexOf(playerID)
		conn.on('message', onActionMessage_({
			writeRule:        writeRule_(game, sendEvent, playerID),
			moveCard:         moveCard_(game, sendEvent, playerSeat),
			accuse:           accuse_(game, sendEvent, playerSeat),
			acceptAccusation: acceptAccusation_(game, sendEvent, playerSeat),
			cancelAccusation: cancelAccusation_(game, sendEvent, playerSeat)
		}))
	})
}



module.exports = createNewGame