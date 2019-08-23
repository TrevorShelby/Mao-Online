function acceptAccusation(round, sendEvent, acceptingSeat) {
	if(round.mode != 'accusation') { return }
	if(round.accusation.accused != acceptingSeat) { return }

	const previousMode = round.accusation.previousMode 

	if(previousMode == 'play') {
		round.mode = 'play'
		round.accusation = undefined
	}
	//second condition should always be true if the round.mode is lastChance. (don't remove though)
	else if(previousMode == 'lastChance' && round.accusation.accused == round.winningSeat) {
		round.lastChance.end()
	}
	else { return }

	sendEvent(round.seating, 'accusationAccepted', previousMode)
}



module.exports = acceptAccusation