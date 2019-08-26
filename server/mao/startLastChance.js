function startLastChance(round, sendEvent, winningSeat) {
	round.mode = 'lastChance'
	round.winningSeat = winningSeat
	sendEvent(round.seating, 'lastChanceBegun', winningSeat)
	endRoundIfLastChancePasses(round)
}


//NOTE: DO NOT replace call with code. This function is async. startLastChance is not.
async function endRoundIfLastChancePasses(round) {
	round.lastChance = { resume: undefined, end: undefined }

	let lastChanceWasSeized = false
	for(let ticksLeft = 100; ticksLeft > 0;) {
		//waits a tick
		await new Promise( (resolve) => {setTimeout(resolve, 100)})

		if(round.mode == 'accusation') { continue }
		else if(round.mode == 'lastChance') { ticksLeft-- }
		else if(round.mode == 'play') { return }
	}

	round.endRound(round.winningSeat)
}



module.exports = startLastChance