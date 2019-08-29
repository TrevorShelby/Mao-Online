const http = require('http')
const WebSocket = require('ws')
const url = require('url')
const uuidv4 = require('uuid/v4')

const createNewTable = require('./mao/newTable.js')


//TODO: Add tables here. Decide on number of tables per server and how many tables get how many
//players to start. Round limit.
const tables = []
for(let playersToStart = 3; playersToStart <= 8; playersToStart++) {
	for(let tableNum = 0; tableNum < 20; tableNum++) {
		tables.push(createNewTable({playersToStart, roundLimit: 10}))
	}
}



const httpServer = http.createServer((req, res) => {
	const reqUrl = url.parse(req.url)
	if(reqUrl.pathname == '/') {
		res.end('<html><script>alert(\'hello\');new WebSocket(\'ws://192.168.137.107:8080\')</script>hey</html>')
	}
	else if(reqUrl.pathname == '/lobbies') {
		res.end( JSON.stringify(getLobbyInfo()) )
	}
	else {
		res.statusCode = 404
		res.end()
	}
})


const tableHostingServer = new WebSocket.Server({server: httpServer})
tableHostingServer.on('connection', (conn, req) => {
	const query = url.parse(req.url, true).query
	const table = tables[parseInt(query.tableID, 10)]
	if(table != undefined) {
		const didJoinTable = table.addPlayer(conn, uuidv4())
		if(!didJoinTable) {
			conn.close(4001, 'Could not join table.')
		}
	}
})



function getLobbyInfo() {
	const lobbyInfo = {}
	tables.forEach( (table, tableID) => {
		if(table.mode == 'lobby') { 
			lobbyInfo[tableID] = {
				numPlayers: table.playerConnections.size,
				maxPlayers: table.options.playersToStart
			}
		}
	})
	return lobbyInfo
}

httpServer.listen(8080)