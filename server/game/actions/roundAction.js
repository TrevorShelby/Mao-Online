function roundAction_(action, table, sendEvent, playerID) {
	function roundAction(data=undefined) {
		if(table.game == undefined) { return }
		if(table.game.inBetweenRounds) { return }
		else {
			const playerSeat = table.game.round.seating.indexOf(playerID)
			action(table.game.round, sendEvent, playerSeat, data)
		}
	}
	return roundAction
}



module.exports = roundAction_