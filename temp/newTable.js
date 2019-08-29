const { 
	rounds, playerIndexes, actionPools, playerConnections, messageHistories, chatLogs
} = require('./relationships.js')
const moveCard_ = require('./actions/moveCard.js')
const talk_ = require('./actions/talk.js')
const safeJsonParse = require('./safeJsonParse.js')
const getPlayingCard = require('./playingCard.js')



function createNewTable(tableIndex, players) {
	const hands = []
	const roundPlayerIndexes = []
	for(let playerIndex = 0; playerIndex < players.length; playerIndex++) {
		roundPlayerIndexes.push(playerIndex)
		hands.push([])
	}
	const topCard = getPlayingCard(Math.floor(Math.random() * 52))
	const piles = [{owner: undefined, cards:[topCard]}]
	const round = {hands, piles}

	rounds.set(tableIndex, round, accusation: undefined)


	chatLogs.set(round, [])

	playerIndexes.set(round, roundPlayerIndexes)

	const roundMessageHistories = new Map()
	messageHistories.set(round, roundMessageHistories)

	const roundActionPools = new Map()
	actionPools.set(round, roundActionPools)

	const roundPlayerConnections = new Map()
	playerConnections.set(round, roundPlayerConnections)

	roundPlayerIndexes.forEach( (playerIndex) => {
		roundMessageHistories.set(playerIndex, [])

		const actionPool = {
			'moveCard': moveCard_(round, playerIndex),
			'talk': talk_(round, playerIndex)
		}
		roundActionPools.set(playerIndex, actionPool)

		const player = players[playerIndex]
		roundPlayerConnections.set(playerIndex, player)
		player.on('message', (messageStr) => {
			const message = safeJsonParse(messageStr)
			if(typeof message != 'object') { return }

			if(message.type == 'action' && typeof message.data == 'object') {
				const { name, data } = message.data
				for(actionName in actionPool) {
					if(name == actionName) {
						const action = actionPool[actionName]
						action(message.ackUID, data)
						break
					}
				}
			}
		})
	})


	return round
}



module.exports = createNewTable