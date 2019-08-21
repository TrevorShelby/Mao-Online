function endAccusation(game, actionPools, newMode) {
	actionPools.forEach( (actionPool) => {
		actionPool.changeActivityByTags(
			(tags) => { return tags.includes(newMode) }
		)
	})
	game.round.mode = newMode
	game.round.accusation = undefined
}



module.exports = endAccusation