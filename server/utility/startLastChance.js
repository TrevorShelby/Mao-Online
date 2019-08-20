const { sendEvent_ } = require('../sendMessage.js')



function startLastChance_(game, seatedActionPools) {
	function startLastChance(winningSeat) {
		game.round.mode = 'lastChance'
		game.round.winner = winningSeat

		seatedActionPools.forEach( (actionPool, poolOwnerSeat) => {
			for(actionName in actionPool.active) {
				if(actionName != 'talk') { delete actionPool.active[actionName] }
			}
			//yes, even for the winner.
			actionPool.activate('accuseWinner')
		})

		endRoundWhenLastChancePasses(game)
	}
	return startLastChance
}


async function endRoundWhenLastChancePasses(game) {
	for(let ticksLeft = 100; tickLeft > 0; ticksLeft--) {
		if(game.round.accusation != undefined) {
			
		}
	}
}



module.exports = startLastChance_