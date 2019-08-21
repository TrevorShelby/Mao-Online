const { sendEvent_ } = require('../sendMessage.js')
const endAccusation = require('../endAccusation.js')



function cancelAccusation_(game, actionPools) {
	function cancelAccusation() {
		if(game.round.mode == 'play') {
			endAccusation(game, actionPools)
		}
		//second condition should always be true if the game.round.mode is lastChance. (don't
		//remove though)
		else if(
			game.round.mode == 'lastChance'
			&& game.round.accusation.accused == game.round.winner
		) {
			//TODO: add resume timer or whatever and then cancel accusation. use same event.
		}
		sendEvent_(game, game.round.seating)('accusationCancelled')
	}
	return cancelAccusation
}



module.exports = cancelAccusation_