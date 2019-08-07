const { playerEvents: {
	chatListener_, startSignalListener_
} } = require('./players.js')
const { seatConnection_ } = require('./seating.js')



function forwardChatMessage_(table, author) {
	function forwardChatMessage(quote) {
		chatMessage = JSON.stringify({event: 'chatMessage', quote, author})
		table.playerInfo.forEach( ({player}) => {
			player.conn.send(chatMessage)
		})
	}
	return forwardChatMessage
}



function getLobbyClass(state) {
	//used to seat connections to the table.
	const seatConnection = seatConnection_(state)
	class Lobby {
		//maybe add checks that table is in state, is in lobby mode, etc. .
		constructor(table) {
			this.table = table
			this.playerListeners = new Map()

			//assignment of this argument felt arbitrary. investigate later.
			this.hookPlayer = ({player, name: author}) => {
				const chatListener = player.addMessageListener_(chatListener_)
				player.on('chatMessage', forwardChatMessage_(this.table, author))
				this.playerListeners.set(player, [chatListener])
			}

			this.table.playerInfo.forEach(this.hookPlayer)
			const startSignalListener = this.table.host.player.addMessageListener_(startSignalListener_)
			this.table.host.player.on('startSignal', ()=>{console.log('the game will now start!')})
			this.playerListeners.get(this.table.host.player).push(startSignalListener)
		}


		joinPlayer(conn) {
			//redundant. seatConnection turns tableID into table anyways. arbitrary abuse of state?
			const tableID = state.tables.getKey(this.table)
			const joinedPlayerInfo = seatConnection(conn, tableID)

			this.hookPlayer(joinedPlayerInfo)

			const sentPlayerInfo = this.table.playerInfo.map(getSendablePlayerInfo)
			const sentTableInfo = {
				players: sentPlayerInfo,
				host: getSendablePlayerInfo(this.table.host),
				maxSeats: this.table.maxSeats,
				mode: 'lobby'
			}
			const successfulJoinMessage = {
				status: 'seated',
				table: sentTableInfo
			}
			joinedPlayerInfo.player.conn.send(JSON.stringify(successfulJoinMessage))
			const playerJoinedMessageStr = JSON.stringify({
				event: 'playerJoined',
				player: getSendablePlayerInfo(joinedPlayerInfo)
			})
			this.table.playerInfo.forEach( ({player}) => {
				if(player.conn != conn) {
					player.conn.send(playerJoinedMessageStr)
				}
			})
		}
	}
	return Lobby
}



function getSendablePlayerInfo(playerInfo) {
	return {
		name: playerInfo.name,
		seat: playerInfo.seat
	}
}



module.exports.getLobbyClass = getLobbyClass