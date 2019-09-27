const React = require('react');

const {
  connect
} = require('react-redux');

const Card = require('./card.js');

const Discard = ({
  cards,
  visibleCardIndex,
  viewNextCard,
  viewPreviousCard
}) => React.createElement(Card, {
  card: cards[visibleCardIndex],
  className: "discard",
  onWheel: e => {
    if (e.deltaY < 0) viewNextCard();
    if (e.deltaY > 0) viewPreviousCard();
  }
});

const mapStateToProps = state => ({
  cards: state.table.mode == 'round' ? state.table.round.discard : [],
  visibleCardIndex: state.visibleDiscardCardIndex
});

const mapDispatchToProps = dispatch => ({
  viewNextCard: () => dispatch({
    type: 'nextDiscardCard'
  }),
  viewPreviousCard: () => {
    dispatch({
      type: 'previousDiscardCard'
    }); //TODO: Still triggers on last card. Also should probably be moved.

    const discard = document.querySelector('.discard');
    const liftedCard = discard.cloneNode();
    liftedCard.textContent = discard.textContent;
    let rightPanel = document.querySelector('.right_panel');
    rightPanel.appendChild(liftedCard);
    liftedCard.addEventListener('animationend', () => rightPanel.removeChild(liftedCard));
    liftedCard.classList.add('lifting');
  }
});

const mergeProps = Object.assign;
module.exports = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Discard);