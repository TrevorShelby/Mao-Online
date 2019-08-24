const WebSocket = require('ws')
const url = require('url')
const uuidv4 = require('uuid/v4')

const createNewTable = require('./mao/newTable.js')


const tables = []


const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	const query = url.parse(req.url, true).query
	if(query.business == 'hosting') {
		tables.push(createNewTable({
			connection: conn, playerID: uuidv4()
		}))
	}
	else if(query.business == 'joining') {
		const table = tables[parseInt(query.tableID, 10)]
		if(table != undefined) {
			table.addPlayer(conn, uuidv4())
		}
	}
})