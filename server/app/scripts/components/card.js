const React = require('react');

const rankSymbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suitSymbols = ['♣', '♦', '♥', '♠'];
const suitColors = ['black', 'red', 'red', 'black'];

const Card = ({
  rank,
  suit
}) => React.createElement("div", {
  className: 'card ' + suitColors[suit]
}, suitSymbols[suit] + '\n' + rankSymbols[rank]);

module.exports = Card;