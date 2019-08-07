const { Card } = require('./card.js')



gameStateExample = {
	cards: {
		hands: [
			[new Card(5), new Card(6)],
			[new Card(1), new Card(3)]
		],
		deck: [new Card(7), new Card(2), new Card)(4)],
		discard: [new Card(0), new Card(8)]
	},
	mode: 'accusation',
	accusation: {
		accusingIndex: 0,
		accusedIndex: 1
	}
}



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



class CardPools {
	//agruments shouldn't be changed from outside? consider copy.
	constructor(hands, deck, discard) {
		this.hands = hands
		this.deck = deck
		this.discard = discard
	}


	drawCard(handIndex) {
		const drawnCard = this.deck.pop()
		this.hands[handIndex].push(drawnCard)
		if(this.deck.length == 0) { this.rebuildDeck() }
		return drawnCard
	}


	playCard(handIndex, cardIndex) {
		const hand = this.cards.hands[handIndex]
		const playedCard = hand.splice(cardIndex, 1)
		this.discard.push(playedCard)
		return playedCard
	}


	rebuildDeck() {
		this.deck = this.deck.concat(this.discard.splice(1))
		shuffle(this.deck)
	}
}



module.exports.CardPools = CardPools