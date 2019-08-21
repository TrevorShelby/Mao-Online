const { sendEvent_ } = require('../sendMessage.js')



function endAccusation_(eventName, game, actionPools, accuserSeat) {
	function endAccusation() {
		if(game.round.mode == 'play') {
			endAccusationDuringPlay()
		}
		//second condition should always be true if the game.round.mode is lastChance. (don't
		//remove though)
		else if(
			game.round.mode == 'lastChance'
			&& game.round.accusation.accused == game.round.winner
		) {
			//TODO: add resume timer or whatever and then cancel accusation. use same event.
		}

		function endAccusationDuringPlay() {
			actionPools.forEach( (actionPool) => {
				actionPool.changeActivityByTags(
					(tags) => { return tags.includes('play') }
				)
			})

			game.round.accusation = undefined
			sendEvent_(game, game.round.seating)(eventName)
		}
	}
	return endAccusation
}



module.exports = endAccusation_