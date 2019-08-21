const { sendEvent_ } = require('../sendMessage.js')



function cancelAccusation_(game, actionPools, accuserSeat) {
	function cancelAccusation() {
		if(game.round.mode == 'play') {
			cancelAccusationDuringPlay()
		}
		//second condition should always be true if the game.round.mode is lastChance. (don't
		//remove though)
		else if(
			game.round.mode == 'lastChance'
			&& game.round.accusation.accused == game.round.winner
		) {
			//TODO: add resume timer or whatever and then cancel accusation. use same event.
		}

		function cancelAccusationDuringPlay() {
			actionPools.forEach( (actionPool) => {
				actionPool.changeActivityByTags(
					(tags) => { return tags.includes('play') }
				)
			})

			game.round.accusation = undefined
			sendEvent_(game, game.round.seating)('accusationCancelled')
		}
	}


	return cancelAccusation
}



module.exports = cancelAccusation_