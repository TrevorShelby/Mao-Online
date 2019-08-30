const Hand_ = require('./hand.js')



const table = {
	game: { round: { seating: ['me'] }},
	me: 'me',
	on(_, func) {
		setTimeout( () => {	
			func({card: {rank: 0, suit: 0}, from: {}, to: {source: 'hand', cardIndex: 0}, by: 0})
		}, 1000)
	}
}

ReactDOM.render(
	React.createElement(new Hand_(table), {}, null),
	document.getElementById('hand')
)