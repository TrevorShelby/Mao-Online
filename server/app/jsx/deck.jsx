const React = require('react')
const { connect } = require('react-redux')
const uuidv4 = require('uuid/v4')

const Card = require('./card.js')



const Deck = ({drawCard}) => ( <div id='deck' className='card' onClick={drawCard} /> )


const mapStateToProps = state => ({
	drawCard: () => {
		state.tableConn.send(JSON.stringify({
			type: 'action',
			name: 'moveCard',
			args: {
				from: {source: 'deck'},
				to: {source: 'hand'}
			}
		}))
	}
})



module.exports = connect(mapStateToProps)(Deck)