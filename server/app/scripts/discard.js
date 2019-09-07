const React = require('react');

const {
  connect
} = require('react-redux');

const uuidv4 = require('uuid/v4');

const Card = require('./card.js');

const Discard = ({
  topCard,
  takeTopCard
}) => React.createElement("div", {
  className: "discard"
}, topCard != undefined && React.createElement(Card, {
  rank: topCard.rank,
  suit: topCard.suit,
  key: uuidv4(),
  onClick: takeTopCard
}), topCard == undefined && React.createElement("div", {
  className: "card"
}));

const mapStateToProps = state => {
  const discard = state.table.round.piles[0].cards;
  const topCardIndex = discard.length - 1;
  return {
    topCard: discard[topCardIndex],
    takeTopCard: () => {
      if (topCardIndex == -1) return;
      if (state.table.round.mode != 'play') return;
      state.tableConn.send(JSON.stringify({
        type: 'action',
        name: 'moveCard',
        args: {
          from: {
            source: 'pile',
            pileIndex: 0,
            cardIndex: topCardIndex
          },
          to: {
            source: 'hand'
          }
        }
      }));
    }
  };
};

module.exports = connect(mapStateToProps)(Discard);