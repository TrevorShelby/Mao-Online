const getPlayingCard = require('../playingCard.js')
const drawCard = () => getPlayingCard(Math.floor(Math.random() * 52))



function endAccusation_(table, enderID) {
	function endAccusation() {
		if(table.mode != 'round') return
		if(table.round.mode != 'accusation') return
		const isAccuser = table.accusation.accuser == enderID
		const isAccused = table.accusation.accused == enderID
		if(!isAccuser && !isAccused) return

		const previousMode = table.accusation.previousMode
		if(previousMode == 'play')
			table.round.mode = 'play'
		//second condition should always be true if the round.mode is lastChance, but is added for
		//redundancy.
		else if(previousMode == 'lastChance' && table.accusation.accused == table.round.winningPlayer) {
			if(isAccused) {
				table.round.mode = 'play'
				table.round.winningPlayer = undefined
			}
			else if(isAccuser)
				table.round.mode = 'lastChance'
		}
		else return

		delete table.accusation
		if(isAccused) {
			const penaltyCard = drawCard()
			const hand = table.round.hands[enderID]
			hand.push(penaltyCard)
			const others = table.playerIDs.filter( playerID => playerID != enderID )
			table.sendEvent(others, 'accusationAccepted', hand.length)
			table.sendEvent([enderID], 'accusationAccepted', penaltyCard)
		}
		else if(isAccuser)
			table.sendEvent(table.playerIDs, 'accusationCancelled', previousMode)
	}
	return endAccusation
}



module.exports = endAccusation_