function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const React = require('react');

const rankSymbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suitSymbols = ['♣', '♦', '♥', '♠'];
const suitColors = ['black', 'red', 'red', 'black'];

const Card = ({
  card: {
    rank,
    suit
  } = {
    rank: undefined,
    suit: undefined
  },
  className = '',
  ...otherProps
}) => React.createElement("div", _extends({
  className: 'card ' + (suitColors[suit] || '') + ' ' + className
}, otherProps), (suitSymbols[suit] || '') + '\n' + (rankSymbols[rank] || ''));

module.exports = Card;