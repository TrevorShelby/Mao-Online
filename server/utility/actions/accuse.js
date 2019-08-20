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

		seatedActionPools.forEach( (actionPool, poolOwnerSeat) => {
			for(let actionName in actionPool.active) {
				if(actionName != 'talk') { delete actionPool.active[actionName] }
			}
		})
		seatedActionPools[accusedSeat].active.activate('acceptAccusation')
		seatedActionPools[accuserSeat].active.activate('cancelAccusation')
		game.round.accusation = {
			accuser: accuserSeat,
			accused: accusedSeat
		}
		sendEvent_(game, game.round.seating)('playerAccused', game.round.accusation)
	}
	return accuse
}



function isValidIndex(index, array) {
	if(typeof index != 'number') { return false }
	else if(index < 0 || index >= array.length) { return false }
	else { return true }
}



module.exports = accuse_