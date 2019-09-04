const React = require('react')
const { connect } = require('react-redux')



const HandLength = ({playerID, numCards}) => (
	<div className='handLength'>
		<div className='nameplate'>{playerID}</div>
		<div className='handLengthDisplay'>{numCards}</div>
	</div>
)


const OthersHandLengths = ({numCardsByPlayerID}) => (
	<div className='handLengths'>
		{numCardsByPlayerID.map( ([playerID, numCards]) => (
			<HandLength playerID={playerID} numCards={numCards} key={playerID} />
		))}
	</div>
)


const mapStateToProps = state => ({
	numCardsByPlayerID: state.table.playerIDs.reduce( (numCardsByPlayerID, playerID, seat) => {
		if(playerID == state.table.me || playerID == undefined) { return numCardsByPlayerID }
		numCardsByPlayerID.push([playerID, state.table.game.round.handLengths[seat]])
		return numCardsByPlayerID
	}, [])
})


module.exports = connect(mapStateToProps)(OthersHandLengths)