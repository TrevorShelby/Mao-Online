const spokenRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
const spokenSuits = ['♣', '♦', '♥', '♠']
function getSpokenCard(card) {
	const spokenRank = spokenRanks[card.rank]
	const spokenSuit = spokenSuits[card.suit]
	return spokenSuit + ' ' + spokenRank
}


module.exports = getSpokenCard