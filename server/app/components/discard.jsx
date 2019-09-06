const React = require('react')
const { connect } = require('react-redux')
const uuidv4 = require('uuid/v4')

const Card = require('./card.js')



const Discard = ({topCard}) => (
	<div className='discard'>
		<Card rank={topCard.rank} suit={topCard.suit} key={uuidv4()} />
	</div>
)



const getLast = (arr) => arr[arr.length - 1]

const mapStateToProps = state => ({
	topCard: getLast(state.table.round.piles[0].cards)
})



module.exports = connect(mapStateToProps)(Discard)