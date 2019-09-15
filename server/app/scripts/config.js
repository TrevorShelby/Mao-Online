const port = 8080
const address = '192.168.137.111'
const createSocket = (tableID, name) => (
	new WebSocket('ws://' + address + ':' + port + '?tableID=' + tableID + '&name=' + name)
)

module.exports = {
	port, address, createSocket
}