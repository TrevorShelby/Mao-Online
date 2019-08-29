//TODO: When the accused or accusers connections drops, accusation must end. This probably doesn't
//have any implication on this file in particular, it's just the only one kinda related to the
//issue at the moment.
//TODO: Add logic for if target is accuser. (only once other accusation actions have been made)
//TODO: Add accusation timeout logic.
function accuse(round, sendEvent, accuserSeat, accusedSeat=undefined) {
	if(!(accusedSeat in round.seating)) { return }

	if(
		round.mode == 'play'
		|| (round.mode == 'lastChance' && accusedSeat == round.winningSeat)
	) {
		startAccusation(accusedSeat)
		sendEvent(round.seating, 'playerAccused', {
			accuser: round.accusation.accuser,
			accused: round.accusation.accused
		})
	}


	function startAccusation(accusedSeat) {
		const previousMode = round.mode
		round.mode = 'accusation'
		round.accusation = {
			accuser: accuserSeat,
			accused: accusedSeat,
			previousMode
		}
	}
}



module.exports = accuse