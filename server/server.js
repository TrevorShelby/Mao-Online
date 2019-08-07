const http = require('http')
const WebSocket = require('ws')

const server = http.createServer()

const wsServer = new WebSocket.Server({server})
wsServer.on('connection', (req, res) => {

})

server.listen(1258)