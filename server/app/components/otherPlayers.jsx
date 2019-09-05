const React = require('react')
const { connect } = require('react-redux')



const HandLength = ({playerID, numCards, onClick}) => (
	<div className='handLength' onClick={onClick}>
		<div>{playerID}</div>
		<div>{numCards}</div>
	</div>
)


const OtherPlayers = ({numCardsByPlayerID, accusePlayer_}) => (
	<div className='handLengths'>
		{numCardsByPlayerID.map( ([playerID, numCards, seat]) => (
			<HandLength
				playerID={playerID} numCards={numCards} onClick={accusePlayer_(seat)} key={playerID}
			/>
		))}
	</div>
)


const mapStateToProps = state => ({
	numCardsByPlayerID: state.table.playerIDs.reduce( (numCardsByPlayerID, playerID, seat) => {
		if(playerID == state.table.me || playerID == undefined) { return numCardsByPlayerID }
		numCardsByPlayerID.push([playerID, state.table.game.round.handLengths[seat], seat])
		return numCardsByPlayerID
	}, []),
	accusePlayer_: seat => () => {
		if(state.table.game.round.mode != 'accusation') {
			state.tableConn.send(JSON.stringify({
				type: 'action',
				name: 'accuse',
				args: seat
			}))
		}
	}
})


module.exports = connect(mapStateToProps)(OtherPlayers)