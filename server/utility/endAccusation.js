function endAccusation(game, actionPools) {
	actionPools.forEach( (actionPool) => {
		actionPool.changeActivityByTags(
			(tags) => { return tags.includes('play') }
		)
	})

	game.round.accusation = undefined
}



module.exports = endAccusation