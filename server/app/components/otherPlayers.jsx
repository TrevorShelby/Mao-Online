const React = require('react')
const { connect } = require('react-redux')



const HandLength = ({playerID, numCards, color, onClick}) => (
	<div className='handLength' onClick={onClick}>
		<span style={{color}}>{playerID}</span>
		<br />
		{ numCards != undefined && <span>{numCards}</span> }
	</div>
)


const OtherPlayers = ({players}) => (
	<div id='handLengths'>
		{Object.keys(players).map( playerID => (
			<HandLength
				playerID={playerID} numCards={players[playerID].numCards}
				onClick={players[playerID].accuse} color={players[playerID].color}
				key={playerID}
			/>
		))}
	</div>
)


const mapStateToProps = state => {
	const stateProps = {}
	stateProps.players = state.table.playerIDs.reduce(
		(players, playerID) => {
			if(playerID == state.table.me) return players
			const player = {}
			if(state.table.mode == 'round') {
				player.numCards = state.table.round.handLengths[playerID]
				player.accuse = () => {
					if(state.table.round.mode != 'accusation') {
						state.tableConn.send(JSON.stringify({
							type: 'action',
							name: 'accuse',
							args: playerID
						}))
					}
				}
			}
			if(state.table.mode != 'lobby') player.color = state.playerColors[playerID]
			return {...players, [playerID]: player}
		}, {}
	)



	if(state.table.mode == 'inBetweenRounds' || state.table.mode == 'lobby') {
		stateProps.numCardsByPlayerID = state.table.playerIDs.reduce(
			(numCardsByPlayerID, playerID) => {
				if(playerID == state.table.me || playerID == undefined) return numCardsByPlayerID
				return {...numCardsByPlayerID, [playerID]: undefined}
			}, {}
		)
		stateProps.accusePlayer_ = ()=>{()=>{}}
	}
	else {
		stateProps.numCardsByPlayerID = state.table.playerIDs.reduce(
			(numCardsByPlayerID, playerID) => {
				if(playerID == state.table.me || playerID == undefined) return numCardsByPlayerID
				return {...numCardsByPlayerID, [playerID]: state.table.round.handLengths[playerID]}
			}, {}
		)
		stateProps.accusePlayer_ = playerID => () => {
			if(state.table.round.mode != 'accusation') {
				state.tableConn.send(JSON.stringify({
					type: 'action',
					name: 'accuse',
					args: playerID
				}))
			}
		}
	}
	return stateProps
}


module.exports = connect(mapStateToProps)(OtherPlayers)