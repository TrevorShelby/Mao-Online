const React = require('react');

const {
  connect
} = require('react-redux');

const Card = require('./card.js');

const Discard = ({
  cards,
  visibleCardIndex,
  viewNextCard,
  viewPreviousCard,
  takeCard
}) => React.createElement(Card, {
  card: cards[visibleCardIndex],
  className: "discard",
  onWheel: e => {
    if (e.deltaY < 0) viewNextCard();
    if (e.deltaY > 0) viewPreviousCard();
  },
  onClick: takeCard
});

const mapStateToProps = state => ({
  cards: state.table.mode == 'round' ? state.table.round.discard : [],
  visibleCardIndex: state.visibleDiscardCardIndex,
  takeCard: () => state.tableConn.send(JSON.stringify({
    type: 'action',
    name: 'moveCard',
    args: {
      from: {
        source: 'discard',
        cardIndex: state.visibleDiscardCardIndex
      },
      to: {
        source: 'hand'
      }
    }
  }))
});

const mapDispatchToProps = dispatch => ({
  viewNextCard: () => dispatch({
    type: 'nextDiscardCard'
  }),
  viewPreviousCard: () => dispatch({
    type: 'previousDiscardCard'
  })
});

const mergeProps = (stateProps, dispatchProps) => ({ ...stateProps,
  ...dispatchProps
});

module.exports = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Discard);