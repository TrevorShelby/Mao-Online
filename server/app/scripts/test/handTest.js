const table = {
	game: { round: { seating: ['me'] }},
	me: 'me',
	on(_, func) {
		setTimeout( () => {	
			func({card: {rank: 0, suit: 0, value: 0}, from: {}, to: {source: 'hand', cardIndex: 0}, by: 0})
		}, 50)
	}
}

const handContainer = document.createElement('div')
document.body.appendChild(handContainer)
ReactDOM.render(
	React.createElement(new Hand_(table), {startingHand: [{suit: 2, rank: 4, value: 30}]}, null),
	handContainer
)