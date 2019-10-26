function startLastChance(table, winningPlayerID) {
	table.round.mode = 'lastChance'
	table.round.lastChance = {
		start: Date.now(),
		pauses: []
	}
	table.round.winningPlayer = winningPlayerID
	table.sendEvent(table.playerIDs, 'lastChanceStarted', {
		winningPlayer: winningPlayerID, timeStarted: Date.now()
	})
	endRoundIfLastChancePasses(table)
}


//NOTE: DO NOT replace call with code. This function is async. startLastChance is not.
async function endRoundIfLastChancePasses(table) {
	while(
		table.round.mode == 'accusation'
		|| Date.now() < getLastChanceEndDatetime(table.round.lastChance)
	) {
		//waits a tick
		await new Promise( (resolve) => {setTimeout(resolve, 100)})

		//table mode could actually become lobby if all players decide to leave between two ticks.
		if(table.mode != 'round') return
		if(table.round.mode == 'accusation') continue
		else if(table.round.mode == 'lastChance') continue
		else if(table.round.mode == 'play') {
			delete table.round.lastChance
			return
		}
	}

	table.mode = 'inBetweenRounds'
	table.lastWinner = table.round.winningPlayer

	table.sendEvent(table.playerIDs, 'roundOver', table.lastWinner)
	delete table.round

	table.numRoundsPlayed += 1
	if(table.numRoundsPlayed == table.options.roundLimit) {
		table.sendEvent(table.playerIDs, 'gameEnded')
		table.connections.forEach( ([_,conn]) => conn.close())
	}
}


function getLastChanceEndDatetime(lastChance) {
	if(lastChance.pauses.length == 0)
		return 10000 + lastChance.start
	else {
		const timePassed = (() => {
			const timeBetweenStartAndFirstPause = lastChance.pauses[0].start - lastChance.start
			const timeBetweenOtherPauses = lastChance.pauses.slice(1).reduce(
				(timeAcc, _, i) => {
					return timeAcc + (lastChance.pauses[i].end - lastChance.pauses[i + 1].start) 
				}, 0
			)
			return timeBetweenStartAndFirstPause + timeBetweenOtherPauses
		})()
		const timeLastPauseEnded = lastChance.pauses[lastChance.pauses.length - 1].end
		return (10000 - timePassed) + timeLastPauseEnded
	}
}


module.exports = startLastChance