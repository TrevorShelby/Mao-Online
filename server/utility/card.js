const suits = ['diamonds', 'clubs', 'hearts', 'spades']
const numCardsPerSuit = 13

function getRank(value) {
	return value % numCardsPerSuit
}
function getSuit(value) {
	const suitIndex = Math.floor(value / numCardsPerSuit)
	return suits[suitIndex]
}



function getCard_(getRank, getSuit) {
	function getCard(value) {
		return {
			value: value,
			rank: getRank(value),
			suit: getSuit(value)
		}
	}
	return getCard
}



module.exports = getCard_(getRank, getSuit)