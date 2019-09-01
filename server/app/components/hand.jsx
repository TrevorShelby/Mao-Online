const uuidv4 = require('uuid/v4')

const Card = require('./card.js')



function Hand_(tableEvents, tableConn) {
	class Hand extends React.Component {
		constructor(props) {
			super(props)
			this.state = { hand: this.props.startingHand.concat([]), selectedCardIndex: -1 }
			//TODO: Add tableEvents.off equivalent when component unmounts (at roundEnded)
			tableEvents.on('cardMoved', (table, {by, from, to}) => {
				const mySeat = table.playerIDs.indexOf(table.me)
				if(by == mySeat && from.source == 'hand') {
					this.setState({selectedCardIndex: -1, hand: table.game.round.me.hand})
				}
				else if(by == mySeat && to.source == 'hand') {
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
								to: { source: 'pile', pileIndex: 0, cardIndex: this.topCardIndex + 1}
							}
						}))
					}
					else {
						this.setState({selectedCardIndex: cardIndex})
					}
				}

				return <Card rank={card.rank} suit={card.suit} key={uuidv4()}
					onClick={onCardClicked} 
					isSelected={this.state.selectedCardIndex == cardIndex}
				/>
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



module.exports = Hand_