const http = require('http')
const WebSocket = require('ws')


setTimeout(() => {




const options = {
	hostname: '192.168.137.107',
	port: 8080,
	path: '/'
}
for(let i = 0; i < 3; i ++) {
	http.request(options, (res) => {
		res.setEncoding('utf-8')
		res.on('data', (chunk) => {
			const tableID = safeJsonParse(chunk).findIndex( (tableInfo) => {
				return !tableInfo.inGame && tableInfo.numPlayers < tableInfo.maxPlayers
			})
			if(i == 2) {
				const client = new WebSocket('ws://192.168.137.107:1258?tableID=' + tableID)
				client.on('message', (messageStr) => {console.log(safeJsonParse(messageStr))})
			}
			new WebSocket('ws://192.168.137.107:1258?tableID=' + tableID)
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