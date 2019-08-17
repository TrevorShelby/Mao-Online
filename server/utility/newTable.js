const { 
	rounds, playerIndexes, actionPools, playerConnections, messageHistories
} = require('./relationships.js')
const { moveCard_ } = require('./actions.js')
const safeJsonParse = require('./safeJsonParse.js')
const getPlayingCard = require('./playingCard.js')



function createNewTable(tableIndex, players) {
	const hands = []
	const playerIndexes = []
	for(let playerIndex = 0; playerIndex < players.length; playerIndex++) {
		playerIndexes.push(playerIndex)
		hands.push([])
	}
	const topCard = getPlayingCard(Math.floor(Math.random() * 52))
	const piles = [{owner: undefined, cards:[topCard]}]
	const round = {hands, piles}

	rounds.set(tableIndex, round)


	const roundMessageHistories = new Map()
	messageHistories.set(round, roundMessageHistories)

	const roundActionPools = new Map()
	actionPools.set(round, roundActionPools)

	const roundPlayerConnections = new Map()
	playerConnections.set(round, roundPlayerConnections)

	playerIndexes.forEach( (playerIndex) => {
		roundMessageHistories.set(playerIndex, [])

		const actionPool = {
			'moveCard': moveCard_(round, playerIndex)
		}
		roundActionPools.set(playerIndex, actionPool)

		const player = players[playerIndex]
		roundPlayerConnections.set(playerIndex, player)
		player.on('message', (messageStr) => {
			const message = safeJsonParse(messageStr)
			if(typeof message != 'object') { return }

			if(message.type == 'action') {
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