function acceptAccusation_(table, acceptorID) {
	function acceptAccusation() {
		if(table.mode != 'round') return
		if(table.round.mode != 'accusation') return
		if(table.accusation.accused != acceptorID) return

		const previousMode = table.accusation.previousMode 

		if(previousMode == 'play') {
			table.round.mode = 'play'
			delete table.accusation
		}
		//second condition should always be true if the round.mode is lastChance. (don't remove though)
		else if(
			previousMode == 'lastChance' && table.accusation.accused == table.round.winningPlayer
		) {
			table.round.mode = 'play'
			delete table.accusation
			table.round.winningPlayer = undefined
		}
		else return


		table.sendEvent(table.playerIDs, 'accusationAccepted')
	}

	return acceptAccusation
}



module.exports = acceptAccusation_