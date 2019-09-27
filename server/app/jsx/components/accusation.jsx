const React = require('react')
const { connect } = require('react-redux')

const PlayerName = require('./playerName.js')


const Accusation = ({accusationData: {accused, accuser}, accusationState, endAccusation}) => (
	<React.Fragment>
		<div className='accusation_tint' />
		<span className='accusation_info'>
			<PlayerName playerID={accuser} /> is penalizing <PlayerName playerID={accused} />.
		</span>
		{accusationState == 1 &&
			<button className='accusation_ender' onClick={endAccusation}>Accept Penalty</button>
		}
		{accusationState == 2 &&
			<button className='accusation_ender' onClick={endAccusation}>Cancel Penalty</button>
		}
	</React.Fragment>
)

const mapStateToProps = state => {
	const stateProps = {}
	stateProps.accusationData = state.table.accusation,
	stateProps.accusationState = (({accused, accuser}, me) => {
		if(accused == me) return 1
		if(accuser == me) return 2
		else return 0
	})(state.table.accusation, state.table.me)
	stateProps.endAccusation = ((accusationState) => {
		if(accusationState == 1 || accusationState == 2)
			return () => {
				state.tableConn.send(JSON.stringify({
					type: 'action',
					name: 'endAccusation'
				}))
			}
		else
			return () => {}
	})(stateProps.accusationState)
	return stateProps
}

module.exports = connect(mapStateToProps)(Accusation)