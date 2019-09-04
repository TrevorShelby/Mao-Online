const React = require('react')
const { connect } = require('react-redux')

const Hand = require('./hand.js')
const Discard = require('./discard.js')



function App({isInRound}) {
	if(!isInRound) { return <div></div> }
	return (
		<div id='table'>
			<Discard />
			<Hand />
		</div>
	)
}


const mapStateToProps = state => ({
	isInRound:
		state != undefined && 'table' in state && 'game' in state.table
		&& 'round' in state.table.game
})



module.exports = connect(mapStateToProps)(App)