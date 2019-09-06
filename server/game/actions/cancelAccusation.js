function cancelAccusation(table, cancelerID) {
	if(table.round.mode != 'accusation') return
	if(table.accusation.accuser != cancelerID) return

	const previousMode = table.accusation.previousMode

	if(previousMode == 'play') {
		table.round.mode = 'play'
		delete table.accusation
	}
	//second condition should always be true if the round.mode is lastChance. (don't remove though)
	else if(previousMode == 'lastChance' && table.accusation.accused == table.round.winningPlayer) {
		table.round.mode = 'lastChance'
		delete table.accusation
	}
	else return

	sendEvent(table.playerIDs, 'accusationCancelled', previousMode)
}



module.exports = cancelAccusation