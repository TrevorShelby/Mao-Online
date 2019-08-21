const { sendEvent_ } = require('../sendMessage.js')

//TODO: When the accused or accusers connections drops, accusation must end. This probably doesn't
//have any implication on this file in particular, it's just the only one kinda related to the
//issue at the moment.



function accuse_(game, actionPools, accuserSeat) {
	//TODO: Add logic for if target is accuser. (only once other accusation actions have been made)
	//TODO: Add accusation timeout logic.
	function accuse(accusedSeat=undefined) {
		if(!(accusedSeat in game.round.seating)) { return }

		if(game.round.mode == 'play') {
			accuseDuringPlay(accusedSeat)
		}
		else if(game.round.mode == 'lastChance') {
			if(accusedSeat == game.round.winner) {
				//TODO: add stop timer or whatever and then accuse. use same event.
			}
			else { return }
		}

		function accuseDuringPlay(accusedSeat) {
			actionPools.forEach( (actionPool) => {
				actionPool.changeActivityByTags( 
					(tags) => { return tags.includes('accusation') }
				)
			})
			actionPools[accusedSeat].activate('acceptAccusation')
			actionPools[accuserSeat].activate('cancelAccusation')
			game.round.accusation = {
				accuser: accuserSeat,
				accused: accusedSeat
			}
			sendEvent_(game, game.round.seating)('playerAccused', game.round.accusation)
		}
	}


	return accuse
}



module.exports = accuse_