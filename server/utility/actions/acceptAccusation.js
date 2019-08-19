const { sendEvent_ } = require('../sendMessage.js')



const legalActionNamesDuringPlay = ['talk', 'moveCard', 'accuse']
//note: seatedActionPools is an array of action pools with each pool at the index of the seat it
//belongs to.
function acceptAccusation_(game, seatedActionPools, accusedSeat) {
	function acceptAccusation() {
		seatedActionPools.forEach( (actionPool, poolOwnerSeat) => {
			for(let actionName in actionPool.active) {
				if(!legalActionNamesDuringPlay.includes(actionName)) {
					delete actionPool.active[actionName]
				}
			}
			legalActionNamesDuringPlay.forEach( (actionName) => {
				if(actionPool.active[actionName] == undefined) {
					actionPool.activate(actionName)
				}
			})
		})

		game.round.accusation = undefined
		sendEvent_(game, game.round.seating)('accusationAccepted')
	}
	return acceptAccusation
}



module.exports = acceptAccusation_