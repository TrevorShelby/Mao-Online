const address = 'ws://192.168.137.107:8080/?tableID=' + getParameterByName('tableID')
const tableConn = new WebSocket(address)
const tableEvents = new TableEvents(tableConn)
new WebSocket(address); new WebSocket(address);
setTimeout( () => {
	tableConn.send(JSON.stringify({
		type: 'action',
		name: 'moveCard',
		args: {
			from: {source: 'deck'},
			to: {source: 'hand'}
		}
	}))
}, 2000)


const Hand = new Hand_(tableEvents)




//credit to: https://stackoverflow.com/a/901144
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}