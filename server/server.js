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
	if(pathname == '/' || pathname == '') {
		res.writeHead(200, {'Content-Type': 'text/html'})
		const filePath = __dirname + '/app/index.html'
		fs.createReadStream(filePath).pipe(res)
	}
	else if(pathname == '/lobbies') {
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.end( JSON.stringify(getLobbyInfo()) )
	}
	//TODO: Figure out which scripts (including components) should be visible to client. doesn't
	//just have to be all necessary ones.
	else if(pathname.startsWith('/scripts/') || pathname.startsWith('/resources/')) {
		const fsPath = __dirname + '/app' + pathname
		if(!fs.existsSync(fsPath)) { res.statusCode = 404; res.end(); return }
		if(pathname.startsWith('/scripts/')) {
			res.writeHead(200,  {'Content-Type': 'text/javascript'})
		}
		fs.createReadStream(fsPath).pipe(res)
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
	if(table != undefined && isValidName(query.name)) {
		const didJoinTable = table.addPlayer(query.name, conn)
		if(!didJoinTable) {
			conn.close(4001, 'Could not join table.')
		}
	}
})

const validCharRegex = /^(([a-z0-9_]+) ?)*[a-z0-9_]$/i
function isValidName(name) {
	if(name.length == 0 || name.length > 20) return false
	return validCharRegex.exec(name) != null
}


function getLobbyInfo() {
	const lobbyInfo = {}
	tables.forEach( (table, tableID) => {
		if(table.mode == 'lobby') { 
			lobbyInfo[tableID] = {
				numPlayers: table.playerIDs.length,
				maxPlayers: table.options.playersToStart
			}
		}
	})
	return lobbyInfo
}

httpServer.listen(8080)