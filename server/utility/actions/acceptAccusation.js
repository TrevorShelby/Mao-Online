const { sendEvent_ } = require('../sendMessage.js')
const endAccusation = require('../endAccusation.js')



function acceptAccusation_(game, actionPools, acceptingSeat) {
	function acceptAccusation() {
		if(game.round.accusation.accused != acceptingSeat) { return }

		if(game.round.accusation.previousMode == 'play') {
			endAccusation(game, actionPools, 'play')
		}
		//second condition should always be true if the game.round.mode is lastChance. (don't
		//remove though)
		else if(
			game.round.accusation.previousMode == 'lastChance'
			&& game.round.accusation.accused == game.round.winner
		) {
			game.round.lastChance.end()
		}
		else { return }

		sendEvent_(game, game.round.seating)('accusationAccepted')
	}
	return acceptAccusation
}



module.exports = acceptAccusation_