const React = require('react')



const spokenRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const spokenSuits = ['♣', '♦', '♥', '♠']
function Card({rank, suit, onClick, highlight}) {
	const spokenRank = spokenRanks[rank]
	const spokenSuit = spokenSuits[suit]
	const color = suit == 0 || suit == 3 ? 'black' : 'red'
	const style = highlight != undefined ? {outline: '2px solid ' + highlight} : {}
	return (
		<div
			className={'card ' + color} onClick={onClick}
			style={style}
		>
			{spokenSuit + '\n' + spokenRank}
		</div>
	)
}


module.exports = Card