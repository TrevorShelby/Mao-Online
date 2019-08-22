const { sendEvent_ } = require('./sendMessage.js')
const endRound = require('./endRound.js')



function startLastChance(game, winningSeat) {
	game.round.mode = 'lastChance'
	game.round.winner = winningSeat
	endRoundIfLastChancePasses(game, winningSeat)
}


//NOTE: DO NOT replace call with code. This function is async. startLastChance is not.
async function endRoundIfLastChancePasses(game, winningSeat) {
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
				game.round.mode = 'play'
				game.round.accusation = undefined
				game.round.lastChance = undefined
				return
			}
			game.round.mode = 'lastChance'
			game.round.accusation = undefined
			game.round.lastChance.resume = undefined
			game.round.lastChance.end = undefined
		}
	}
	endRound(game, game.round.seating[winningSeat])
	sendEvent_(game, game.round.seating)('roundOver', winningSeat)
}



module.exports = startLastChance