const React = require('react');

const {
  connect
} = require('react-redux');

const uuidv4 = require('uuid/v4');

const Card = require('./card.js');

const Discard = ({
  topCard
}) => React.createElement("div", {
  className: "discard"
}, React.createElement(Card, {
  rank: topCard.rank,
  suit: topCard.suit,
  key: uuidv4()
}));

const getLast = arr => arr[arr.length - 1];

const mapStateToProps = state => ({
  topCard: getLast(state.table.game.round.piles[0].cards)
});

module.exports = connect(mapStateToProps)(Discard);