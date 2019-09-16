const React = require('react')
const { connect } = require('react-redux')

const AccusationInfo = require('./accusationInfo.js')
const { CancelAccusationButton, AcceptAccusationButton } = require('./accusationButtons.js')



const Accusation = ({accusationState}) => (<React.Fragment>
	{accusationState > -1 && (<React.Fragment>
		<div id='overlay' style={{backgroundColor: '#00000088'}}></div>
		<AccusationInfo />
	</React.Fragment>)}
	{accusationState == 1 &&
		<CancelAccusationButton />
	}
	{accusationState == 2 &&
		<AcceptAccusationButton />
	}
</React.Fragment>)

const mapStateToProps = state => {
	const roundIsInAccusation = state.table.round.mode == 'accusation'
	//-1 when not in accusation, 0 if not involved in accusation, 1 if accuser, 2 if accused
	const accusationState = (() => {
		if(!roundIsInAccusation) return -1
		const { table: {accusation, me } } = state
		if(accusation.accuser == me) return 1
		if(accusation.accused == me) return 2
		return 0
	})()
	return { accusationState }
}


module.exports = connect(mapStateToProps)(Accusation)