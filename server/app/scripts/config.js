const port = 8080
const address = '192.168.137.111'
const createSocket = (tableID, name) => (
	new WebSocket('ws://' + address + ':' + port + '?tableID=' + tableID + '&name=' + name)
)

const seatColors = [
	'#dc3823', '#f6b709', '#50a332', '#33b4cc', '#384bc7', '#d02f7c', '#944ab5', '#818181'
]

module.exports = {
	port, address, createSocket, seatColors
}