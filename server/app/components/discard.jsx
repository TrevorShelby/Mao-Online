const React = require('react')
const { connect } = require('react-redux')
const uuidv4 = require('uuid/v4')

const Card = require('./card.js')



const Discard = ({topCard, onClick}) => (
	<div id='discard'>
		{topCard != undefined && 
			<Card
				rank={topCard.rank} suit={topCard.suit} key={uuidv4()} highlight={topCard.playedBy}
				onClick={onClick}
			/>
		}
		{ topCard == undefined && <div className='card' /> }
	</div>
)



const mapStateToProps = state => {
	const discard = state.table.round.piles[0].cards
	const topCard = discard[discard.length - 1]
	const coloredTopCard = topCard != undefined ? {
		rank: topCard.rank, suit: topCard.suit,
		playedBy: state.playerColors[topCard.playedBy]
	} : undefined
	return {
		topCard: coloredTopCard,
		onClick: function takeTopCard() {
			if(topCard == undefined) return
			if(state.table.round.mode != 'play') return
			state.tableConn.send(JSON.stringify({
				type: 'action',
				name: 'moveCard',
				args: {
					from: {source: 'pile', pileIndex: 0, cardIndex: discard.length - 1},
					to: {source: 'hand'}
				}
			}))
		}
	}
}



module.exports = connect(mapStateToProps)(Discard)