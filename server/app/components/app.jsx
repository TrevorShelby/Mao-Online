const React = require('react')
const { connect } = require('react-redux')

const Hand = require('./hand.js')
const Discard = require('./discard.js')
const OtherPlayers = require('./otherPlayers.js')
const { CancelAccusationButton, AcceptAccusationButton } = require('./accusationButtons.js')



const App = ({tableHasRound, playerHasToWriteRule, accusationState, playerID, tint}) => (
	<div id='table'>
		{playerID != undefined &&
			<span className='nameplate'>{playerID}</span>
		}
		{tableHasRound && (<React.Fragment>
			<OtherPlayers />
			<Discard />
			<Hand />
			<div className='overlay' style={{backgroundColor: tint}}></div>
		</React.Fragment>)}
		{accusationState == 1 &&
			<CancelAccusationButton />
		}
		{accusationState == 2 &&
			<AcceptAccusationButton />
		}
	</div>
)


const mapStateToProps = state => {
	const tableExists = state != undefined && 'table' in state
	const tableHasRound = tableExists && 'game' in state.table && 'round' in state.table.game
	const playerHasToWriteRule = (
		tableExists && 'game' in state.table && state.table.game.inBetweenRounds
		&& state.table.game.lastWinner == state.table.me
	)
	const roundIsInAccusation = tableHasRound && state.table.game.round.mode == 'accusation'
	//-1 when not in accusation, 0 if not involved in accusation, 1 if accuser, 2 if accused
	const accusationState = (() => {
		if(!roundIsInAccusation) { return -1 }
		const { table: {game: {round: {accusation, me: {seat: mySeat} } } } } = state
		if(accusation.accuser == mySeat) { return 1 }
		if(accusation.accused == mySeat) { return 2 }
		return 0
	})()
	const tint = roundIsInAccusation ? '#00000088' : '#00000000'
	return {
		tableHasRound,
		playerHasToWriteRule,
		accusationState,
		playerID: tableExists ? state.table.me : undefined,
		tint
	}
}





module.exports = connect(mapStateToProps)(App)