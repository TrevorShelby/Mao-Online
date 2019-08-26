const http = require('http')
const WebSocket = require('ws')



const options = {
	hostname: '192.168.137.107',
	port: 8080,
	path: '/'
}
http.request(options, (res) => {
	res.on('data', (chunk) => {
		console.log(chunk)
	})
}).end()



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