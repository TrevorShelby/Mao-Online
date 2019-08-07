const { Player } = require('./players.js')



let tableID = 0
function getNewTableID() {
	return tableID++
}



function getConnectionName_(state) {
	function getConnectionName(conn) {
		return state.tokensToNames.get(state.connectionsToTokens.get(conn))	
	}
	return getConnectionName
}



function giveConnectionHostship_(state) {
	const getConnectionName = getConnectionName_(state)

	function giveConnectionHostship(
		hostConn, options={maxSeats: 5}
	) {
		const tableID = getNewTableID()
		const hostPlayerInfo = {
			player: new Player(hostConn),
			name: getConnectionName(hostConn),
			seat: 0
		}
		const table = {
			playerInfo: [
				hostPlayerInfo
			],
			host: hostPlayerInfo,
			maxSeats: options.maxSeats,
			mode: 'lobby'
		}
		state.tables.set(tableID, table)
		state.connectionsToTableIDs.set(hostConn, tableID)

		return tableID
	}

	return giveConnectionHostship
}



function findLowestSeat(table) {
	let filledSeats = []
	table.playerInfo.forEach( (playerInfo) => {
		filledSeats.push(playerInfo.seat)
	})
	for(seat = 0; seat < table.maxSeats; seat++) {
		if(!filledSeats.includes(seat)) {
			return seat
		}
	}
	return -1
}



function seatConnection_(state) {
	const getConnectionName = getConnectionName_(state)

	function seatConnection(conn, tableID) {
		const table = state.tables.get(tableID)
		const playerInfo = {
			player: new Player(conn),
			name: getConnectionName(conn),
			seat: findLowestSeat(table)
		}
		table.playerInfo.push(playerInfo)
		return playerInfo
	}

	return seatConnection
}



module.exports.getConnectionName_ = getConnectionName_
module.exports.giveConnectionHostship_ = giveConnectionHostship_
module.exports.seatConnection_ = seatConnection_