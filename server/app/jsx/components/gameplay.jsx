const React = require('react')
const { connect } = require('react-redux')
const uuidv4 = require('uuid/v4')

const Card = require('./card.js')
const PlayerSeat = require('./playerSeat.js')



const getWidth = (numCards) => 'calc((1.5em + 2px + 4px) * ' + numCards + ')'
const MyHand = (() => {
	const VisibleHand = ({cards}) => (
		<div className='my_hand' style={{fontSize: 'large', width: getWidth(cards.length)}}>
			{cards.map(
				card => <Card card={card} key={uuidv4()} />
			)}
		</div>
	)
	const mapStateToProps = state => ({ cards: state.table.round.myHand })
	return connect(mapStateToProps)(VisibleHand)
})()



const getOtherPlayers = table => table.playerIDs.filter( playerID => playerID != table.me )
const Gameplay = ({table}) => (
	<div className='right_panel'>
		{getOtherPlayers(table).map( playerID => <PlayerSeat playerID={playerID} key={playerID} /> )}
		{table.mode == 'round' && <MyHand />}
	</div>
)
const mapStateToProps = state => ({ table: state.table })

module.exports = connect(mapStateToProps)(Gameplay)