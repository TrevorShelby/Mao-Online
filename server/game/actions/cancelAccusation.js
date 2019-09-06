function cancelAccusation_(table, cancelerID) {
	function cancelAccusation() {
		if(table.mode != 'round') return
		if(table.round.mode != 'accusation') return
		if(table.accusation.accuser != cancelerID) return

		const previousMode = table.accusation.previousMode

		if(previousMode == 'play') {
			table.round.mode = 'play'
			delete table.accusation
		}
		//second condition should always be true if the round.mode is lastChance. (don't remove though)
		else if(
			previousMode == 'lastChance' && table.accusation.accused == table.round.winningPlayer
		) {
			table.round.mode = 'lastChance'
			delete table.accusation
		}
		else return

		table.sendEvent(table.playerIDs, 'accusationCancelled', previousMode)
	}
	return cancelAccusation
}



module.exports = cancelAccusation_