function startLastChance(table, winningPlayerID) {
	table.round.mode = 'lastChance'
	table.round.winningPlayer = winningPlayerID
	table.sendEvent(table.playerIDs, 'lastChanceStarted', {
		winningPlayer: winningPlayerID, timeStarted: Date.now()
	})
	endRoundIfLastChancePasses(table)
}


//NOTE: DO NOT replace call with code. This function is async. startLastChance is not.
async function endRoundIfLastChancePasses(table) {
	let lastChanceWasSeized = false
	for(let ticksLeft = 100; ticksLeft > 0;) {
		//waits a tick
		await new Promise( (resolve) => {setTimeout(resolve, 100)})

		if(table.round.mode == 'accusation') continue
		else if(table.round.mode == 'lastChance') ticksLeft--
		else if(table.round.mode == 'play') return
	}

	table.mode = 'inBetweenRounds'
	table.lastWinner = table.round.winningPlayer

	table.sendEvent(table, 'roundOver', winningPlayerID)
	delete table.round

	table.numRoundsPlayed += 1
	if(table.numRoundsPlayed == table.options.roundLimit) {
		table.sendEvent(table.playerIDs, 'gameEnded')
		table.connections.forEach( ([_,conn]) => conn.close())
	}
}



module.exports = startLastChance