const React = require('react')
const { connect } = require('react-redux')

const Hand = require('./hand.js')
const Discard = require('./discard.js')
const OthersHandLengths = require('./othersHandLengths.js')



function App({tableHasRound, tint, playerID}) {
	if(!tableHasRound && playerID == undefined) { return <div></div> }
	if(!tableHasRound && playerID != undefined) { 
		return <div><span className='clientName'>{playerID}</span></div>
	}
	return (
		<div id='table'>
			<OthersHandLengths />
			<Discard />
			<Hand />
			<span className='clientName'>{playerID}</span>
			<div className='overlay' style={{backgroundColor: tint}}></div>
		</div>
	)
}


const mapStateToProps = state => {
	const tableExists = state != undefined && 'table' in state
	const tableHasRound = tableExists && 'game' in state.table && 'round' in state.table.game
	const tint = (
		tableHasRound && state.table.game.round.mode == 'accusation' ? '#00000088' : '#00000000'
	)
	return {
		tableHasRound,
		tint,
		playerID: tableExists ? state.table.me : undefined
	}
}





module.exports = connect(mapStateToProps)(App)