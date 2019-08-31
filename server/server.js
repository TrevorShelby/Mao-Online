const http = require('http')
const WebSocket = require('ws')
const url = require('url')
const uuidv4 = require('uuid/v4')
const fs = require('fs')

const createNewTable = require('./game/newTable.js')



const tables = []
for(let playersToStart = 2; playersToStart <= 8; playersToStart++) {
	for(let tableNum = 0; tableNum < 20; tableNum++) {
		tables.push(createNewTable({playersToStart, roundLimit: 10}))
	}
}


const httpServer = http.createServer((req, res) => {
	const {pathname, query} = url.parse(req.url, true)
	if(pathname == '/') {
		res.writeHead(200, {'Content-Type': 'text/html'})
		const scriptPath = __dirname + '/app/index.html'
		fs.createReadStream(scriptPath).pipe(res)
	}
	else if(pathname == '/lobbies') {
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.end( JSON.stringify(getLobbyInfo()) )
	}
	else if(pathname.startsWith('/scripts/')) {
		const scriptPath = __dirname + '/app/scripts/' + pathname.split('/').slice(2).join('/')
		if(!fs.existsSync(scriptPath)) { res.statusCode = 404; res.end(); return }
		res.writeHead(200,  {'Content-Type': 'text/javascript'})
		fs.createReadStream(scriptPath).pipe(res)
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