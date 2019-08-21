const { sendEvent_ } = require('../sendMessage.js')



function acceptAccusation_(game, actionPools, accusedSeat) {
	function acceptAccusation() {
		if(game.round.mode == 'play') {
			cancelAccusationDuringPlay()
		}
		//second condition should always be true if the game.round.mode is lastChance. (don't
		//remove though)
		else if(
			game.round.mode == 'lastChance'
			&& game.round.accusation.accused == game.round.winner
		) {
			//TODO: add resume timer or whatever and then accept accusation. use same event.
		}

		function acceptAccusationDuringPlay() {
			actionPools.forEach( (actionPool) => {
				actionPool.changeActivityByTags(
					(tags) => { return tags.includes('play') }
				)
			})

			game.round.accusation = undefined
			sendEvent_(game, game.round.seating)('accusationAccepted')
		}
	}
	return acceptAccusation
}



module.exports = acceptAccusation_