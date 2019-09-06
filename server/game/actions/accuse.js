//TODO: When the accused or accusers connections drops, accusation must end. This probably doesn't
//have any implication on this file in particular, it's just the only one kinda related to the
//issue at the moment.
//TODO: Add logic for if target is accuser. (only once other accusation actions have been made)
//TODO: Add accusation timeout logic.
function accuse(table, accuserID, accusedID=undefined) {
	if(!(accusedID in table.playerIDs)) { return }

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
	table.sendEvent(table.playerIDs, 'playerAccused', {
		accuser: table.accusation.accuser,
		accused: table.accusation.accused
	})
}



module.exports = accuse