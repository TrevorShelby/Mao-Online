const { sendEvent_ } = require('./sendMessage.js')
const endRound = require('./endRound.js')
const endAccusation = require('./endAccusation.js')



function startLastChance_(game, actionPools) {
	function startLastChance(winningSeat) {
		game.round.mode = 'lastChance'
		game.round.winner = winningSeat

		actionPools.forEach( (actionPool, poolOwnerSeat) => {
			actionPool.changeActivityByTags(
				(tags) => { return tags.includes('lastChance') }
			)
			//yes, even for the winner.
			actionPool.activate('accuse')
		})

		endRoundWhenLastChancePasses(game, actionPools, winningSeat)
	}
	return startLastChance
}


async function endRoundWhenLastChancePasses(game, actionPools, winningSeat) {
	game.round.lastChance = { resume: undefined, end: undefined }

	let lastChanceWasSeized = false
	for(let ticksLeft = 100; ticksLeft > 0; ticksLeft--) {
		//waits a tick
		await new Promise( (resolve) => {setTimeout(resolve, 100)})

		if(game.round.mode == 'accusation') {
			await new Promise( (resolve) => {
				game.round.lastChance.resume = resolve
				game.round.lastChance.end = () => {
					lastChanceWasSeized = true
					resolve()
				}
			})
			if(lastChanceWasSeized) {
				game.round.lastChance = undefined
				endAccusation(game, actionPools, 'play')
				return
			}
			endAccusation(game, actionPools, 'lastChance')
			game.round.lastChance.resume = undefined
			game.round.lastChance.end = undefined
		}
	}
	endRound(game, actionPools, winningSeat)
	sendEvent_(game, game.round.seating)('roundOver', winningSeat)
}



module.exports = startLastChance_