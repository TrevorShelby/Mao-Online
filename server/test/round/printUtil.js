const rankNames = ['A','2','3','4','5','6','7','8','9','T','J','Q','K']
const suitNames = ['♦', '♣', '♥', '♠']
function getSpokenCard(card) {
	const rankName = rankNames[card.rank]
	const suitName = suitNames[card.suit]
	return rankName + suitName
}


function printRound(round) {
	console.log('\n')
	round.piles.forEach( (pile) => {
		const spokenCards = []
		pile.cards.forEach( ({isFaceUp, identity}) => {
			const spokenIdentity = getSpokenCard(identity)
			spokenCards.push({isFaceUp, identity: spokenIdentity})
		})
		if(pile.owner != undefined) { console.log(pile.owner) }
		else { console.log('discard') }
		console.log(spokenCards)
		console.log()
	})
	console.log()
	let playerNum = 0
	round.hands.forEach( (hand) => {
		const spokenHand = []
		hand.forEach( (cardIdentity) => {
			spokenHand.push(getSpokenCard(cardIdentity))
		})
		console.log(playerNum + ': ' + spokenHand.join('  '))
		playerNum++
	})
	console.log('\n')
}


module.exports.getSpokenCard = getSpokenCard
module.exports.printRound = printRound