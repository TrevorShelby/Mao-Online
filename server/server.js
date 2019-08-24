const WebSocket = require('ws')
const url = require('url')
const uuidv4 = require('uuid/v4')

const createNewTable = require('./mao/newTable.js')


//TODO: Add tables here. Decide on number of tables per server and how many tables get how many
//players to start.
const tables = []


const wsServer = new WebSocket.Server({port: 1258})
wsServer.on('connection', (conn, req) => {
	const query = url.parse(req.url, true).query
	if(query.business == 'joining') {
		const table = tables[parseInt(query.tableID, 10)]
		if(table != undefined) {
			table.addPlayer(conn, uuidv4())
		}
	}
})