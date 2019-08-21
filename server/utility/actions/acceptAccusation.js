const { sendEvent_ } = require('../sendMessage.js')



function acceptAccusation_(game, actionPools, accusedSeat) {
	function acceptAccusation() {
		actionPools.forEach( (actionPool) => {
			actionPool.changeActivityByTags(
				(tags) => { return tags.includes('play') }
			)
		})

		game.round.accusation = undefined
		sendEvent_(game, game.round.seating)('accusationAccepted')
	}
	return acceptAccusation
}



module.exports = acceptAccusation_