const React = require('react')
const { connect } = require('react-redux')



const spokenRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
const spokenSuits = ['♣', '♦', '♥', '♠']
const  getSpokenCard = card => {
	const spokenRank = spokenRanks[card.rank]
	const spokenSuit = spokenSuits[card.suit]
	return spokenSuit + ' ' + spokenRank
}


const getGameMessage = (data, topCardIndex) => {
	if(data.from.source == 'deck' && data.to.source == 'hand') {
		return data.by + ' drew a card.'
	}
	if(data.from.source == 'hand' && data.to.source == 'pile') {
		if(data.to.pileIndex == 0 && data.to.cardIndex == topCardIndex) {
			return data.by + ' played  ' + getSpokenCard(data.card) + '.'
		}
	}
	if(data.from.source == 'hand' && data.to.source == 'deck') {
		return data.by + ' burned one of their cards.'
	}
	return data.by + ' moved a card.'
}


//TODO: Remove messages once they finish animation (use uuid as key). Add more detail to messages.
//Add accusation end details.
class GameMessages extends React.Component {
	constructor(props) {
		super(props)
		this.state = {messages: [], gameMessageListener: undefined}
	}

	componentDidMount() {
		const gameMessageListener = messageEvent => {
			const message = JSON.parse(messageEvent.data)
			if(message.type == 'event' && message.name == 'cardMoved') {
				const newGameMessage = getGameMessage(message.data, this.props.topCardIndex)
				this.setState( state => ({
					messages: state.messages.concat(newGameMessage)
				}))
			}
		}
		this.props.tableConn.on('message', gameMessageListener)
		this.setState({gameMessageListener})
	}

	componentWillUnmount() {
		this.props.tableConn.off('message', this.state.gameMessageListener)
	}

	render() {
		return (
			<div id='gameMessages'>
				{this.state.messages.map( (message, i) => (
					<span className='gameMessage' key={i}>{message}</span>
				))}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	tableConn: state.tableConn,
	topCardIndex: state.table.round.piles[0].cards.length - 1
})



module.exports = connect(mapStateToProps)(GameMessages)