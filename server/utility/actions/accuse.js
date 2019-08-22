const { sendEvent_ } = require('../sendMessage.js')

//TODO: When the accused or accusers connections drops, accusation must end. This probably doesn't
//have any implication on this file in particular, it's just the only one kinda related to the
//issue at the moment.



function accuse_(game, accuserSeat) {
	//TODO: Add logic for if target is accuser. (only once other accusation actions have been made)
	//TODO: Add accusation timeout logic.
	function accuse(accusedSeat=undefined) {
		if(!(accusedSeat in game.round.seating)) { return }

		if(
			game.round.mode == 'play'
			|| (game.round.mode == 'lastChance' && accusedSeat == game.round.winner)
		) { 
			startAccusation(accusedSeat)
			sendEvent_(game, game.round.seating)('playerAccused', {
				accuser: game.round.accusation.accuser,
				accused: game.round.accusation.accused
			})
		}


		function startAccusation(accusedSeat) {
			const previousMode = game.round.mode
			game.round.mode = 'accusation'
			game.round.accusation = {
				accuser: accuserSeat,
				accused: accusedSeat,
				previousMode
			}
		}
	}


	return accuse
}



module.exports = accuse_