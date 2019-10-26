//TODO: When the accused or accusers connections drops, accusation must end. This probably doesn't
//have any implication on this file in particular, it's just the only one kinda related to the
//issue at the moment.
//TODO: Add logic for if target is accuser. (only once other accusation actions have been made)
//TODO: Add accusation timeout logic.
function accuse_(table, accuserID) {
	function accuse(accusedID=undefined) {
		if(table.mode != 'round') return
		if(!table.playerIDs.includes(accusedID)) return

		if(
			table.round.mode != 'play'
			&& !(table.round.mode == 'lastChance' && table.round.winningPlayer == accusedID)
		) return

		const previousMode = table.round.mode
		table.round.mode = 'accusation'
		table.accusation = {
			accuser: accuserID,
			accused: accusedID,
			previousMode
		}
		if(previousMode == 'lastChance') table.accusation.pauseStart = Date.now()
		table.sendEvent(table.playerIDs, 'playerAccused', {
			accuser: table.accusation.accuser,
			accused: table.accusation.accused,
			at: table.accusation.pauseStart || Date.now()
		})
	}

	return accuse
}



module.exports = accuse_