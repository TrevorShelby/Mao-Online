const { sendEvent_ } = require('../sendMessage.js')

//TODO: When the accused or accusers connections drops, accusation must end. This probably doesn't
//have any implication on this file in particular, it's just the only one kinda related to the
//issue at the moment.


//note: seatedActionPools is an array of action pools with each pool at the index of the seat it
//belongs to.
function accuse_(game, seatedActionPools, accuserSeat) {
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
			seatedActionPools.forEach( (actionPool, poolOwnerSeat) => {
				for(let actionName in actionPool.active) {
					if(actionName != 'talk') { delete actionPool.active[actionName] }
				}
			})
			seatedActionPools[accusedSeat].activate('acceptAccusation')
			seatedActionPools[accuserSeat].activate('cancelAccusation')
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