const { createSocket } = require('./config.js')



function hookStoreToTable(dispatch) {
	const tableID = parseInt(getParameterByName('tableID'), 10)
	const tableConn = createSocket(tableID)

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



//credit to: https://stackoverflow.com/a/901144
function getParameterByName(name) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



module.exports = hookStoreToTable