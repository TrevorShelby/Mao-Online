const { createNewSocket } = require('./config.js')



function hookStoreToTable(dispatch) {
	const tableConn = createSocket(0)

	tableConn.onmessage = (messageEvent) => {
		const message = JSON.parse(messageEvent.data)
		if(message.type == 'event') {
			dispatch({
				type: message.name,
				data: message.data
			})
		}
	}

	return tableConn
}



module.exports = hookStoreToTable