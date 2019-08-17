const onMessage_ = require('./playerListener.js')
const round = require('./round.js')
const getPlayingCard = require('./playingCard.js')
const getSpokenCard = require('./spokenCard.js')



function printRound() {
	const spokenHands = []
	round.hands.forEach( (hand) => {
		const spokenHand = []
		spokenHands.push(spokenHand)
		hand.forEach( (card) => {
			spokenHand.push(getSpokenCard(card))
		})
	})

	const spokenPiles = []
	round.piles.forEach( (pile) => {
		const spokenPile = []
		spokenPiles.push(spokenPile)
		pile.cards.forEach( (card) => {
			spokenPile.push(getSpokenCard(card))
		})
	})

	console.log('hands:')
	console.log(spokenHands)
	console.log()
	console.log('piles:')
	console.log(spokenPiles)
}



//Adds intial card to discard
const cardValue = Math.floor(Math.random() * 52)
round.piles[0].cards.push(getPlayingCard(cardValue))

//JSON of action that draws a card from the deck into the player's hand
const drawAction = {
	name: 'moveCard',
	data: {
		from: {source: 'deck'},
		to: {source: 'hand'}
	}
}

//Draws 7 cards for each 4 players
const playerListeners = []
for(let handNum = 0; handNum < 4; handNum++) {
	const onMessage = onMessage_(handNum)
	playerListeners.push(onMessage)
	const hand = []
	round.hands.push(hand)
	for(let cardNum = 0; cardNum < 7; cardNum++) {
		onMessage(JSON.stringify({
			type: 'action',
			ackUID: cardNum,
			data: drawAction
		}))
	}
}

printRound()
console.log()


//JSON of action that plays a card from the player's hand into the dekc
const playAction = {
	name: 'moveCard',
	data: {
		from: {source: 'hand', cardIndex: 6},
		to: {source: 'pile', pileIndex: 0, cardIndex: 0},

	}
}
playerListeners[0](JSON.stringify({
	type: 'action',
	ackUID: 7,
	data: playAction
}))
printRound()


const takeAction = {
	name: 'moveCard',
	data: {
		from: {source: 'pile', pileIndex: 0, cardIndex: 1},
		to: {source: 'hand'}
	}
}
playerListeners[3](JSON.stringify({
	type: 'action',
	ackUID: 7,
	data: takeAction
}))
printRound()