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
		let className = 'card ' + this.color
		if(this.props.isSelected) { className += ' selected'}
		return (
			<div className={className} onClick={this.props.onClick}>
				{this.spokenSuit + '\n' + this.spokenRank}
			</div>
		)
	}
}


module.exports = Card