function Hand_(tableEvents, tableConn) {
	class Hand extends React.Component {
		constructor(props) {
			super(props)
			this.state = { hand: this.props.startingHand.concat([]), selectedCardIndex: -1 }
			//TODO: Add tableEvents.off equivalent when component unmounts (at roundEnded)
			tableEvents.on('cardMoved', (table, {by, from, to}) => {
				const mySeat = table.playerIDs.indexOf(table.me)
				if(by == mySeat && (to.source == 'hand' || from.source == 'hand')) {
					this.setState({hand: table.game.round.me.hand})
				}
				if(
					(from.source == 'pile' && from.pileIndex == 0)
					|| (to.source == 'pile' && to.pileIndex == 0)
				) {
					this.topCardIndex = table.game.round.piles[0].cards.length - 1
				}
			})
			this.topCardIndex = 0
			this.tableConn = tableConn
		}


		render() {
			const cardElements = this.state.hand.map( (card, cardIndex) => {
				const onCardClicked = () => {
					if(this.state.selectedCardIndex == cardIndex) {
						this.tableConn.send(JSON.stringify({
							type: 'action',
							name: 'moveCard',
							args: {
								from: { source: 'hand', cardIndex },
								to: { source: 'pile', pileIndex: 0, cardIndex: this.topCardIndex}
							}
						}))
					}
					else {
						this.setState({selectedCardIndex: cardIndex})
					}
				}
				return <Card rank={card.rank} suit={card.suit} key={card.value} onClick={onCardClicked} />
			})
			return (
				<div class='myHand'>
					{cardElements}
				</div>
			)
		}
	}

	return Hand
}



const spokenRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const spokenSuits = ['♣', '♦', '♥', '♠']
class Card extends React.Component {
	constructor(props) {
		super(props)
		this.spokenRank = spokenRanks[this.props.rank]
		this.spokenSuit = spokenSuits[this.props.suit]
		this.color = this.props.suit == 0 || this.props.suit == 3 ? 'black' : 'red'
	}

	render() {
		return (
			<div class={'card ' + this.color} onClick={this.props.onClick}>{this.spokenSuit + '\n' + this.spokenRank}</div>
		)
	}
}