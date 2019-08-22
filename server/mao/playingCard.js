const numCardsPerSuit = 13
function getRank(value) {
	return value % numCardsPerSuit
}
function getSuit(value) {
	return Math.floor(value / numCardsPerSuit)
}



function getPlayingCard_(getRank, getSuit) {
	function getPlayingCard(value) {
		return {
			value: value,
			rank: getRank(value),
			suit: getSuit(value)
		}
	}
	return getPlayingCard
}



module.exports = getPlayingCard_(getRank, getSuit)