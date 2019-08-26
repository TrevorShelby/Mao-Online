function cancelAccusation(round, sendEvent, cancellingSeat) {
	if(round.mode != 'accusation') { return }
	if(round.accusation.accuser != cancellingSeat) { return }

	const previousMode = round.accusation.previousMode

	if(previousMode == 'play') {
		round.mode = 'play'
		round.accusation = undefined
	}
	//second condition should always be true if the round.mode is lastChance. (don't remove though)
	else if(previousMode == 'lastChance' && round.accusation.accused == round.winningSeat) {
		round.mode = 'lastChance'
		round.accusation = undefined
		round.lastChance.resume = undefined
		round.lastChance.end = undefined
	}
	else { return }

	sendEvent(round.seating, 'accusationCancelled', previousMode)
}



module.exports = cancelAccusation