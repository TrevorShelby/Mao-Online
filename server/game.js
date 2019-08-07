const { getDeck } = require('./utility/card.js')
const { CardPools } = require('./utility/game_state.js')
const { playerEvents: {playCardListener_} } = require('./players.js')



function getCards(numPlayers) {
	const hands = new Array(numPlayers)
	hands.fill([])
	const deck = getDeck()
	const discard = []

	hands.forEach( (hand) => {
		for(numCardsDrawn = 0; numCardsDrawn < 7; numCardsDrawn++) {
			hand.push(deck.pop())
		}
	})
	discard.push(deck.pop())
	return new CardPools(hands, deck, discard)
}



function onPlayCard_(players, cards, handIndex) {
	function onPlayCard(cardIndex) {
		const playedCard = cards.playCard(handIndex, cardIndex)
		const cardPlayedMessageStr = JSON.stringify({
			event: 'cardPlayed', card: playedCard
		})
		players.forEach( ({conn}) => {
			conn.send(cardPlayedMessageStr)
		})
	}
	return onPlayCard
}



class Game {
	constructor(players) {
		this.players = players
		this.state = {
			cards: getCards(players.length)
		}

		this.players.forEach( (player) => {
			const playCardListener = player.addMessageListener(playCardListener_)
			playerListeners.set(player, [playCardListener])
		})
	}
}