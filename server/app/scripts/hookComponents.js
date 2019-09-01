const TableEvents = require('./tableEvents.js')
const Hand_ = require('./hand.js')
const Discard_ = require('./discard.js')


const address = 'ws://192.168.137.107:8080/?tableID=' + getParameterByName('tableID')
const tableConn = new WebSocket(address)
const tableEvents = new TableEvents(tableConn)
const Hand = new Hand_(tableEvents, tableConn)
const Discard = new Discard_(tableEvents)



// new WebSocket(address); new WebSocket(address);




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



module.exports = { Hand, Discard, tableEvents }