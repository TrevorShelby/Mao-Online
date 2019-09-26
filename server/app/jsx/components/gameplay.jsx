const React = require('react')
const { connect } = require('react-redux')

const Card = require('./card.js')
const PlayerSeat = require('./playerSeat.js')
const MyHand = require('./myHand.js')
const Accusation = require('./accusation.js')
const RuleInput = require('./ruleInput.js')


const Discard = (() => {
	const Discard = ({cards, visibleCardIndex, viewNextCard, viewPreviousCard}) => (
		<Card
			card={cards[visibleCardIndex]} className='discard'
			onWheel={e => {
				if(e.deltaY < 0) viewNextCard()
				if(e.deltaY > 0) viewPreviousCard()
			}}
		/>
	)

	const mapStateToProps = state => ({
		cards: state.table.mode == 'round' ? state.table.round.piles[0].cards : [],
		visibleCardIndex: state.visibleDiscardCardIndex
	})
	const mapDispatchToProps = dispatch => ({
		viewNextCard: () => dispatch({type: 'nextDiscardCard'}),
		viewPreviousCard: () => dispatch({type: 'previousDiscardCard'})
	})
	const mergeProps = Object.assign
	return connect(mapStateToProps, mapDispatchToProps, mergeProps)(Discard)
})()


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


const getOtherPlayers = table => table.playerIDs.filter( playerID => playerID != table.me )
const Gameplay = ({table}) => (
	<div className='right_panel'>
		{getOtherPlayers(table).map( playerID => <PlayerSeat playerID={playerID} key={playerID} /> )}
		<Discard />
		<Deck />
		{table.mode == 'round' && <React.Fragment>
			<MyHand />
			{table.round.mode == 'accusation' && <Accusation />}
		</React.Fragment>}
		{table.mode == 'inBetweenRounds' && <RuleInput />}
	</div>
)
const mapStateToProps = state => ({ table: state.table })

module.exports = connect(mapStateToProps)(Gameplay)