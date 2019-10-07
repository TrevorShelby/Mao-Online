function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const React = require('react');

const {
  connect
} = require('react-redux');

const uuidv4 = require('uuid/v4');

const Card = require('./card.js');

const getWidth = numCards => 'calc((1.5em + 2px + 4px) * ' + numCards + ')';

const VisibleHand = ({
  cards,
  playerColor,
  selectedCardIndex,
  selectCard,
  playCard
}) => React.createElement("div", {
  className: "my_hand",
  style: {
    fontSize: 'large',
    width: getWidth(cards.length)
  }
}, cards.map((card, cardIndex) => {
  const props = (() => {
    if (cardIndex == selectedCardIndex) return {
      style: {
        outline: '2px solid ' + playerColor
      },
      onClick: () => playCard(cardIndex)
    };else return {
      onClick: () => selectCard(cardIndex)
    };
  })();

  return React.createElement(Card, _extends({
    card: card
  }, props, {
    key: uuidv4()
  }));
}));

const mapStateToProps = state => ({
  cards: state.table.round.myHand,
  playerColor: state.playerColors[state.table.me],
  selectedCardIndex: state.selectedCardIndex,
  visibleDiscardCardIndex: state.visibleDiscardCardIndex,
  tableConn: state.tableConn
});

const mapDispatchToProps = dispatch => ({
  selectCard: cardIndex => dispatch({
    type: 'cardSelected',
    selectedCardIndex: cardIndex
  })
});

const mergeProps = (stateProps, dispatchProps) => ({
  cards: stateProps.cards,
  playerColor: stateProps.playerColor,
  selectedCardIndex: stateProps.selectedCardIndex,
  selectCard: dispatchProps.selectCard,
  playCard: cardIndex => {
    stateProps.tableConn.send(JSON.stringify({
      type: 'action',
      name: 'moveCard',
      args: {
        from: {
          source: 'hand',
          cardIndex: cardIndex
        },
        to: {
          source: 'discard',
          cardIndex: stateProps.visibleDiscardCardIndex + 1
        }
      }
    }));
    dispatchProps.selectCard(-1);
  }
});

module.exports = connect(mapStateToProps, mapDispatchToProps, mergeProps)(VisibleHand);