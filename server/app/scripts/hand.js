const React = require('react');

const {
  connect
} = require('react-redux');

const uuidv4 = require('uuid/v4');

const Card = require('./card.js');

function Hand({
  cardObjs
}) {
  const cardElements = cardObjs.map(({
    rank,
    suit
  }) => {
    return React.createElement(Card, {
      rank: rank,
      suit: suit,
      key: uuidv4()
    });
  });
  return React.createElement("div", null, cardElements);
}

const mapStateToProps = state => ({
  cardObjs: state.table.game.round.me.hand
});

module.exports = connect(mapStateToProps)(Hand);