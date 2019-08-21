const { sendEvent_ } = require('./sendMessage.js')



function endRound(game, actionPools, winningSeat) {
	game.round.lastChance = undefined
	game.round.mode = 'betweenRounds'
	game.round.winner = winningSeat

	actionPools.forEach( (actionPool) => {
		actionPool.changeActivityByTags( 
			(tags) => { return tags.includes('accusation') }
		)
	})
	actionPools[winningSeat].activate('writeRule')	
}



module.exports = endRound