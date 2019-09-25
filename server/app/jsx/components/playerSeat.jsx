const React = require('react')
const { connect } = require('react-redux')

const PlayerName = require('./playerName.js')
const { seatPositionsByNumOtherPlayersAndOrder } = require('../config.js')



const PlayerSeat = ({playerID, numCards, position}) => (
	<div className='hand_length' style={position}>
		<div className='card hand_length_card'>{numCards}</div>
		<PlayerName playerID={playerID} />
	</div>
)

const mapStateToProps = state => ({
	handLengths: state.table.mode == 'round' ? state.table.round.handLengths : state.table.playerIDs.reduce(
		(preRoundHandLengths, playerID) => Object.assign({[playerID]: 0}, preRoundHandLengths),
		{}
	),
	playerIDs: state.table.playerIDs,
	me: state.table.me
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
	})(stateProps.playerIDs, ownProps.playerID, stateProps.me)
})

module.exports = connect(mapStateToProps, undefined, mergeProps)(PlayerSeat)