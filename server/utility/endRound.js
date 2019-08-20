const { sendEvent_ } = require('./sendMessage.js')



function endRound_(game, seatedActionPools) {
	function endRound(winningSeat) {
		game.round.mode = 'betweenRounds'
		game.round.winner = winningSeat

		seatedActionPools.forEach( (actionPool, poolOwnerSeat) => {
			for(actionName in actionPool.active) { 
				if(actionName != 'talk') { delete actionPool.active[actionName] }
			}

			if(poolOwnerSeat == winningSeat) { actionPool.activate('writeRule') }
		})

		sendEvent_(game, game.round.seating)('roundOver', winningSeat)
	}
	return endRound
}



module.exports = endRound_