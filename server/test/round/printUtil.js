const rankNames = [
	'ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen',
	'king'
]
const suitNames = ['diamonds', 'clubs', 'hearts', 'spades']
function getSpokenCard(card) {
	const rankName = rankNames[card.rank]
	const suitName = suitNames[card.suit]
	return rankName + ' of ' + suitName
}


function printRound(round) {
	console.log('\n')
	round.piles.forEach( (pile) => {
		const spokenCards = []
		pile.cards.forEach( ({isFaceUp, identity}) => {
			const spokenIdentity = getSpokenCard(identity)
			spokenCards.push({isFaceUp, spokenIdentity})
		})
		console.log(pile.owner)
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
		console.log([playerNum, spokenHand])
		playerNum++
	})
	console.log('\n')
}


module.exports.getSpokenCard = getSpokenCard
module.exports.printRound = printRound