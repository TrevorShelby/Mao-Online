const React = require('react')
const { connect } = require('react-redux')



const {CancelAccusationButton, AcceptAccusationButton} = (() => {
	const AccusationButton = ({endAccusation, text}) => (
		<button id='accusationEnder' onClick={endAccusation}>{text}</button>
	)

	const mapStateToProps_ = actionName => state => (
		{
			endAccusation: () => {
				state.tableConn.send(JSON.stringify({
					type: 'action',
					name: actionName
				}))
			},
			text: actionName == 'cancelAccusation' ? 'Cancel Penalty' : 'Accept Penalty'
		}
	)

	return {
		CancelAccusationButton: connect(mapStateToProps_('cancelAccusation'))(AccusationButton),
		AcceptAccusationButton: connect(mapStateToProps_('acceptAccusation'))(AccusationButton)
	}
})()



const AccusationInfo = (() => {
	const AccusationInfo = ({accuser, accused}) => (
		<span id='accusationInfo'><b>{accuser}</b> has accused <b>{accused}</b></span>
	)

	return connect(state => state.table.accusation)(AccusationInfo)
})()



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