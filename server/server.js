const http = require('http')
const url = require('url')
const WebSocket = require('ws')

const { BiMap } = require('./utility/bimap.js')
const { getLobbyClass } = require('./lobby.js')
const { giveConnectionHostship_, seatConnection_ } = require('./seating.js')



const server = http.createServer()



const tables = new BiMap()
const connectionsToTableIDs = new Map()

const names = ['Alpha', '1', 'Red']
const tokens = ['a', 'o', 'r']
const tokensToNames = new BiMap(tokens, names)
const connectionsToTokens = new BiMap()

//This is a bit iffy, since the Lobby class hasn't even been decided yet, but the state is required
//to create (not instantiate) the Lobby class, and no matter what, the Lobby class always has the
//same design. A more elegant solution may be found later.
const tablesToLobbies = new BiMap()

const state = {
	tables, connectionsToTableIDs, tablesToLobbies, tokensToNames, connectionsToTokens
}

const Lobby = getLobbyClass(state)

const giveConnectionHostship = giveConnectionHostship_(state)
const seatConnection = seatConnection_(state)


function joinConnectionToTable(conn, tableID) {
	if(typeof tableID == 'number' && tableID >= 0) {
		const table = tables.get(tableID)
		//Closes the connection if the table doesn't exist.
		if(table == undefined) {
			conn.close(4002, 'Table ' + tableID + ' does not exist.')
			return
		}

		//Seats the connection to table or closes it if the connection can't be seated.
		const tableHasOpenSeats = table.playerInfo.length < table.maxSeats
		if(tableHasOpenSeats && table.mode == 'lobby') {
			const lobby = tablesToLobbies.get(table)
			lobby.joinPlayer(conn)
		}
		else if(!tableHasOpenSeats) {
			conn.close(4003, 'Table ' + tableID + ' does not have any open seats.')
		}
	}
	//Closes the connection if the given tableID could never be associated with a table.
	else {
		conn.close(4001, 'tableID must be a number over 0')
	}
}


function verifyClient(info) {
	const token = url.parse(info.req.url, parseQueryString=true).query.token
	//TODO: Make sure client isn't multiplying sessions by using their token more than once.
	let clientIsAlreadyConnected = false
	connectionsToTokens.forEach(
		(_, connectedToken) => {
			if(token==connectedToken) {clientIsAlreadyConnected = true}
		}
	)
	return tokens.includes(token) && !clientIsAlreadyConnected
}
const gameServer = new WebSocket.Server({server, verifyClient})
gameServer.on(
	'connection',
	(conn, req) => {
		const query = url.parse(req.url, parseQueryString=true).query
		connectionsToTokens.set(conn, query.token)
		conn.on('close', () => {connectionsToTokens.delete(conn)})

		if(query.business == 'hosting') {
			//A lobby should be created and then the connection should be joined to it as its host.
			const tableID = giveConnectionHostship(conn)
			const table = tables.get(tableID)
			tablesToLobbies.set(table, new Lobby(table))
		}
		else if(query.business == 'joining') {
			joinConnectionToTable(conn, parseInt(query.tableID))
		}
	}
)



server.listen(1258)