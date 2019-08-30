function Hand_(table) {
	class Hand extends React.Component {
		constructor(props) {
			super(props)
			this.state = { hand: this.props.startingHand.concat([]) }
			table.on('moveCard', ({card, from, to, by}) => {
				const mySeat = table.game.round.seating.indexOf(table.me)
				if(by != mySeat) { return }

				if(from.source == 'hand') {
					this.removeCard(from.cardIndex)
				}
				else if(to.source == 'hand') {
					this.addCard(card, to.cardIndex)
				}
				else { return }
			})
		}


		addCard(card, cardIndex) {
			this.setState( (state) => {
				const hand = state.hand
				return {
					hand: hand.slice(0, cardIndex).concat([card]).concat(hand.slice(cardIndex))
				}
			})
		}


		removeCard(cardIndex) {
			this.setState( (state) => {
				const hand = state.hand
				return { hand: hand.slice(0, cardIndex).concat(hand.slice(cardIndex + 1)) }
			})
		}


		render() {
			const cardElements = this.state.hand.map( (card) => {
				return <Card rank={card.rank} suit={card.suit} key={card.value}/>
			})
			return (
				<div id='hand'>
					{cardElements}
				</div>
			)
		}
	}

	return Hand
}



const spokenRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
const spokenSuits = ['♣', '♦', '♥', '♠']
class Card extends React.Component {
	constructor(props) {
		super(props)
		this.spokenRank = spokenRanks[this.props.rank]
		this.spokenSuit = spokenSuits[this.props.suit]
	}

	render() {
		return (
			<div class='card'>{this.spokenSuit + '\n' + this.spokenRank}</div>
		)
	}
}