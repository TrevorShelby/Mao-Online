const http = require('http')
const WebSocket = require('ws')

const server = http.createServer()

const wsServer = new WebSocket.Server({server})

server.listen(1258)