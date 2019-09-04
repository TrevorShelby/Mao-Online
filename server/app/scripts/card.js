const React = require('react');

const spokenRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const spokenSuits = ['♣', '♦', '♥', '♠'];

function Card({
  rank,
  suit,
  onClick,
  isSelected = false
}) {
  const spokenRank = spokenRanks[rank];
  const spokenSuit = spokenSuits[suit];
  const color = suit == 0 || suit == 3 ? 'black' : 'red';
  const className = !isSelected ? 'card ' + color : 'card ' + color + ' selected';
  return React.createElement("div", {
    className: className,
    onClick: onClick
  }, spokenSuit + '\n' + spokenRank);
}

module.exports = Card;