function acceptAccusation_(game, sendEvent, acceptingSeat) {
	function acceptAccusation() {
		if(game.inBetweenRounds) { return }
		if(game.round.mode != 'accusation') { return }
		if(game.round.accusation.accused != acceptingSeat) { return }

		if(game.round.accusation.previousMode == 'play') {
			game.round.mode = 'play'
			game.round.accusation = undefined
		}
		//second condition should always be true if the game.round.mode is lastChance. (don't
		//remove though)
		else if(
			game.round.accusation.previousMode == 'lastChance'
			&& game.round.accusation.accused == game.round.winningSeat
		) {
			game.round.lastChance.end()
		}
		else { return }

		sendEvent(game.round.seating, 'accusationAccepted')
	}
	return acceptAccusation
}



module.exports = acceptAccusation_