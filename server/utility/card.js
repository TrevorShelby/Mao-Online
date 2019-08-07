class Card {
	constructor(value) {
		this.value = value
		this.suit = this.getSuit()
		this.rank = this.getRank()
	}


	getSuit() {
		let suitIndex = Math.floor(this.value / 13)
		if(suitIndex < 4) {
			return Card.suits[suitIndex]
		}
		else {
			return undefined
		}
	}


	getRank() {
		if(this.value <= 52) {
			return (this.value % 13) + 1
		}
		else {
			return undefined
		}
	}
}
Card.suits = ['clubs', 'diamonds', 'hearts', 'spades']

module.exports.Card = Card



//Credit to https://stackoverflow.com/a/6274381
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}



function getDeck({withJokers=false, shuffled=true}={}) {
	const deck = []
	const numCards = !withJokers ? 52 : 54
	for(value = 0; value < numCards; value++) {
		deck.push(new Card(value))
	}

	if(shuffled) { shuffle(deck) }

	return deck
}

module.exports.getDeck = getDeck