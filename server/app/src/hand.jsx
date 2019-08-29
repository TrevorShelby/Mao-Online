function Hand_(table) {
	class Hand extends React.Component {
		constructor(props) {
			super(props)
			this.state = { hand: [] }
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
			const hand = this.state.hand
			this.setState( (state) => {
				return { 
					hand: hand.slice(0, cardIndex).concat([card]).concat(hand.slice(cardIndex))
				}
			})
		}


		removeCard(cardIndex) {
			const hand = this.state.hand
			this.setState( (state) => {
				return { hand: hand.slice(0, cardIndex).concat(hand.slice(cardIndex + 1)) }
			})
		}


		render() {
			const cardElements = this.state.hand.map( (card) => {
				return <Card rank={card.rank} suit={card.suit} />
			})
			return (
				<div id="hand">
					{cardElements}
				</div>
			)
		}
	}

	return Hand
}



const cardStyles = {
	width: '20px',
	height: '30px',
	outline: '1px solid black'
}
class Card extends React.Component {
	render() {
		return (
			<div style={cardStyles}>{this.props.rank + ', ' + this.props.suit}</div>
		)
	}
}


module.exports = Hand_