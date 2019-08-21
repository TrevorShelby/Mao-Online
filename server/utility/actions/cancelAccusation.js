const { sendEvent_ } = require('../sendMessage.js')
const endAccusation = require('../endAccusation.js')



function cancelAccusation_(game, actionPools) {
	function cancelAccusation() {
		if(game.round.accusation.previousMode == 'play') {
			endAccusation(game, actionPools, 'play')
		}
		//second condition should always be true if the game.round.mode is lastChance. (don't
		//remove though)
		else if(
			game.round.accusation.previousMode == 'lastChance'
			&& game.round.accusation.accused == game.round.winner
		) {
			game.round.lastChance.resume()
		}
		sendEvent_(game, game.round.seating)('accusationCancelled')
	}
	return cancelAccusation
}



module.exports = cancelAccusation_