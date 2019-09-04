const React = require('react');

const {
  connect
} = require('react-redux');

const Card = require('./card.js');

function Discard({
  topCard
}) {
  return React.createElement(Card, {
    rank: topCard.rank,
    suit: topCard.suit
  });
}

const getLast = arr => arr[arr.length - 1];

const mapStateToProps = state => ({
  topCard: getLast(state.table.game.round.piles[0].cards)
});

module.exports = connect(mapStateToProps)(Discard);