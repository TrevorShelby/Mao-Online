const React = require('react')
const { connect } = require('react-redux')

const Hand = require('./hand.js')
const Discard = require('./discard.js')
const OthersHandLengths = require('./othersHandLengths.js')



function App({isInRound, playerID}) {
	if(!isInRound && playerID == undefined) { return <div></div> }
	if(!isInRound && playerID != undefined) { return <div><span className='clientName'>{playerID}</span></div> }
	return (
		<div id='table'>
			<OthersHandLengths />
			<Discard />
			<Hand />
			<span className='clientName'>{playerID}</span>
		</div>
	)
}


const mapStateToProps = state => ({
	isInRound:
		state != undefined && 'table' in state && 'game' in state.table
		&& 'round' in state.table.game,
	playerID: state != undefined && 'table' in state ? state.table.me : undefined
})



module.exports = connect(mapStateToProps)(App)