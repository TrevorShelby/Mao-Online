const http = require('http')
const WebSocket = require('ws')


setTimeout(() => {




const address = '192.168.137.117'
const options = {
	hostname: address,
	port: 8080,
	path: '/'
}
for(let i = 0; i < 3; i ++) {
	http.request(options, (res) => {
		res.setEncoding('utf-8')
		let data = ''
		res.on('data', (chunk) => {data += chunk})
		res.on('end', () => {
			const tableID = safeJsonParse(data).findIndex( (tableInfo) => {
				return !tableInfo.inGame && tableInfo.numPlayers < tableInfo.maxPlayers
			})
			if(i == 2) {
				const client = new WebSocket('ws://' + address + ':1258?tableID=' + tableID)
				client.on('message', (messageStr) => {console.log(safeJsonParse(messageStr))})
			}
			new WebSocket('ws://' + address + ':1258?tableID=' + tableID)
		})
	}).end()
}




}, 100)



function safeJsonParse(objStr) {
	let obj
	try {
		obj = JSON.parse(objStr)
	}
	catch(err) {
		obj = objStr
	}
	return obj
}