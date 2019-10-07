const React = require('react')
const { connect } = require('react-redux')

const Card = require('./card.js')
const PlayerSeat = require('./playerSeat.js')
const Discard = require('./discard.js')
const MyHand = require('./myHand.js')
const Accusation = require('./accusation.js')
const RuleInput = require('./ruleInput.js')
const { seatPositionsByNumOtherPlayersAndOrder } = require('../config.js')



const canDraw = table => table.mode == 'round' && table.round.mode == 'play'
const Deck = (() => {
	const Deck = ({drawCard}) => <Card onClick={drawCard} className='deck' />
	const mapStateToProps = state => ({
		drawCard: canDraw(state.table) ? () => {
			state.tableConn.send(JSON.stringify({
				type: 'action',
				name: 'moveCard',
				args: {
					from: { source: 'deck' },
					to: { source: 'hand' }
				}
			}))
		} : () => {}
	})
	return connect(mapStateToProps)(Deck)
})()


class AnimatedCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {className: this.props.fromClassName, position: this.props.fromPosition}
	}

	componentDidMount() {
		setTimeout( () => {
			this.setState({className: this.props.toClassName, position: this.props.toPosition})
		}, 0)
	}

	render() {return(
		<Card 
			style={Object.assign({...this.state.position}, {transition: 'bottom .5s, right .5s', zIndex: 1})}
			className={this.state.className}
			card={this.props.card}
		/>
	)}
}



const getClassName = (direction, by, me) => {
	if(direction.source == 'hand' && by == me) return 'my_hand'
	else return direction.source
}
const getPosition = (playerIDs, direction, by, me) => {
	if(direction.source != 'hand' || by == me) return {}
	const playerIndex = playerIDs.indexOf(by)
	const myIndex = playerIDs.indexOf(me)
	const orderFromMe = (() => {
		if(playerIndex < myIndex) return playerIDs.length - myIndex + playerIndex - 1
		else return playerIndex - myIndex - 1
	})()
	return seatPositionsByNumOtherPlayersAndOrder[playerIDs.length - 1][orderFromMe]
}
const getOtherPlayers = table => table.playerIDs.filter( playerID => playerID != table.me )

class Gameplay extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {
		this.playCardMoveAnimation = messageEvent => {
			const message = JSON.parse(messageEvent.data)
			if(message.type != 'event' || message.name != 'cardMoved') return
			const {from, to, by, card} = message.data
			const fromClassName = getClassName(from, by, this.props.table.me)
			const toClassName = getClassName(to, by, this.props.table.me)
			const fromPosition = getPosition(this.props.table.playerIDs, from, by, this.props.table.me)
			const toPosition = getPosition(this.props.table.playerIDs, to, by, this.props.table.me)

			const animatedCard = (
				<AnimatedCard
					fromClassName={fromClassName} toClassName={toClassName}
					fromPosition={fromPosition} toPosition={toPosition}
					card={card || {rank: undefined, suit: undefined}} 
				/>
			)
			this.setState({animatedCard})
			setTimeout( () => this.setState({animatedCard: undefined}), 500)
		}
		//this.props.tableConn.on('message', this.playCardMoveAnimation)
	}

	//componentWillUnmount() { this.props.tableConn.off('message', this.playCardMoveAnimation) }

	render() {const table = this.props.table; return (
		<div className='right_panel'>
			{getOtherPlayers(table).map( playerID => <PlayerSeat playerID={playerID} key={playerID} /> )}
			<Discard />
			<Deck />
			{table.mode == 'round' && <React.Fragment>
				<MyHand />
				{table.round.mode == 'accusation' && <Accusation />}
			</React.Fragment>}
			{table.mode == 'inBetweenRounds' && table.me == table.lastWinner && <RuleInput />}
		</div>
	)}
}


const mapStateToProps = state => ({ table: state.table, tableConn: state.tableConn })

module.exports = connect(mapStateToProps)(Gameplay)