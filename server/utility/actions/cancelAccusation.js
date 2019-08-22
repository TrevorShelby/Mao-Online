const { sendEvent_ } = require('../sendMessage.js')
const endAccusation = require('../endAccusation.js')



function cancelAccusation_(game, cancellingSeat) {
	function cancelAccusation() {
		if(game.inBetweenRounds) { return }
		if(game.round.mode != 'accusation') { return }
		if(game.round.accusation.accuser != cancellingSeat) { return }

		if(game.round.accusation.previousMode == 'play') {
			endAccusation(game, 'play')
		}
		//second condition should always be true if the game.round.mode is lastChance. (don't
		//remove though)
		else if(
			game.round.accusation.previousMode == 'lastChance'
			&& game.round.accusation.accused == game.round.winner
		) {
			game.round.lastChance.resume()
		}
		else { return }

		sendEvent_(game, game.round.seating)('accusationCancelled')
	}
	return cancelAccusation
}



module.exports = cancelAccusation_