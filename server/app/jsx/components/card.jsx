const React = require('react')


const rankSymbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const suitSymbols = ['♣', '♦', '♥', '♠']
const suitColors = ['black', 'red', 'red', 'black']
const Card = ({card: {rank, suit}={rank: undefined, suit: undefined}}) => (
	<div className={'card ' + (suitColors[suit] || '')}>
		{(suitSymbols[suit] || '') + '\n' + (rankSymbols[rank] || '')}
	</div>
)


module.exports = Card