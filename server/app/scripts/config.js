const port = 8080
const address = '192.168.137.107'
const createSocket = (tableID) => new WebSocket('ws://' + address + ':' + port + '?tableID=' + tableID)

module.exports = {
	port, address, createSocket
}