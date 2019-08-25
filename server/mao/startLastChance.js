function startLastChance(round, winningSeat) {
	round.mode = 'lastChance'
	round.winningSeat = winningSeat
	endRoundIfLastChancePasses(round, winningSeat)
}


//NOTE: DO NOT replace call with code. This function is async. startLastChance is not.
async function endRoundIfLastChancePasses(round, winningSeat) {
	round.lastChance = { resume: undefined, end: undefined }

	let lastChanceWasSeized = false
	for(let ticksLeft = 100; ticksLeft > 0; ticksLeft--) {
		//waits a tick
		await new Promise( (resolve) => {setTimeout(resolve, 100)})

		//TODO: Move this code somewhere else. Causes error where accepting and cancelling an
		//accusation can happen during lastChance accusation, but before resume and end functions
		//are added.
		if(round.mode == 'accusation') {
			await new Promise( (resolve) => {
				round.lastChance.resume = resolve
				round.lastChance.end = () => {
					lastChanceWasSeized = true
					resolve()
				}
			})
			if(lastChanceWasSeized) {
				round.mode = 'play'
				round.accusation = undefined
				round.lastChance = undefined
				return
			}
			round.mode = 'lastChance'
			round.accusation = undefined
			round.lastChance.resume = undefined
			round.lastChance.end = undefined
		}
	}

	round.endRound(winningSeat)
}



module.exports = startLastChance