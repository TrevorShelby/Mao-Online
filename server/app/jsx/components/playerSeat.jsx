const React = require('react')
const { connect } = require('react-redux')

const PlayerName = require('./playerName.js')
const { seatPositionsByNumOtherPlayersAndOrder } = require('../config.js')



const PlayerSeat = ({playerID, numCards, position, accusePlayer}) => (
	<div className='hand_length' style={position}>
		<div className='card hand_length_card' onClick={accusePlayer}>{numCards}</div>
		<PlayerName playerID={playerID} onClick={accusePlayer} style={{textAlign: 'center'}} />
	</div>
)

const mapStateToProps = state => ({
	handLengths: state.table.mode == 'round' ? state.table.round.handLengths : state.table.playerIDs.reduce(
		(emptyHandLengths, playerID) => Object.assign({[playerID]: 0}, emptyHandLengths),
		{}
	),
	playerIDs: state.table.playerIDs,
	me: state.table.me,
	canAccuse: (
		state.table.mode == 'round'
		&& (state.table.round.mode == 'play' || state.table.round.mode == 'accusation')
	),
	tableConn: state.tableConn
})

const mergeProps = (stateProps, _, ownProps) => ({
	playerID: ownProps.playerID,
	numCards: stateProps.handLengths[ownProps.playerID],
	position: ((playerIDs, playerID, me) => {
		const playerIndex = playerIDs.indexOf(playerID)
		const myIndex = playerIDs.indexOf(me)
		const orderFromMe = (() => {
			if(playerIndex < myIndex) return playerIDs.length - myIndex + playerIndex - 1
			else return playerIndex - myIndex - 1
		})()
		return seatPositionsByNumOtherPlayersAndOrder[playerIDs.length - 1][orderFromMe]
	})(stateProps.playerIDs, ownProps.playerID, stateProps.me),
	accusePlayer: stateProps.canAccuse ? () => {
		stateProps.tableConn.send(JSON.stringify({
			type: 'action',
			name: 'accuse',
			args: ownProps.playerID
		}))
	} : () => {}
})

module.exports = connect(mapStateToProps, undefined, mergeProps)(PlayerSeat)