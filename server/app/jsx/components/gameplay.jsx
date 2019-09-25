const React = require('react')
const { connect } = require('react-redux')

const Card = require('./card.js')
const PlayerSeat = require('./playerSeat.js')
const MyHand = require('./myHand.js')


const Discard = (() => {
	const Discard = ({cards}) => <Card card={cards[cards.length - 1]} className='discard' />
	const mapStateToProps = state => ({
		cards: state.table.mode == 'round' ? state.table.round.piles[0].cards : []
	})
	return connect(mapStateToProps)(Discard)
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
			{console.log(table.round)}
			{table.round.mode == 'accusation' && <div className='accusation_tint'></div>}
		</React.Fragment>}
	</div>
)
const mapStateToProps = state => ({ table: state.table })

module.exports = connect(mapStateToProps)(Gameplay)