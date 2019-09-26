const React = require('react');

const {
  connect
} = require('react-redux');

const Card = require('./card.js');

const PlayerSeat = require('./playerSeat.js');

const MyHand = require('./myHand.js');

const Accusation = require('./accusation.js');

const RuleInput = require('./ruleInput.js');

const Discard = (() => {
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
    cards: state.table.mode == 'round' ? state.table.round.piles[0].cards : [],
    visibleCardIndex: state.visibleDiscardCardIndex
  });

  const mapDispatchToProps = dispatch => ({
    viewNextCard: () => dispatch({
      type: 'nextDiscardCard'
    }),
    viewPreviousCard: () => dispatch({
      type: 'previousDiscardCard'
    })
  });

  const mergeProps = Object.assign;
  return connect(mapStateToProps, mapDispatchToProps, mergeProps)(Discard);
})();

const canDraw = table => table.mode == 'round' && table.round.mode == 'play';

const Deck = (() => {
  const Deck = ({
    drawCard
  }) => React.createElement(Card, {
    onClick: drawCard,
    className: "deck"
  });

  const mapStateToProps = state => ({
    drawCard: canDraw(state.table) ? () => {
      state.tableConn.send(JSON.stringify({
        type: 'action',
        name: 'moveCard',
        args: {
          from: {
            source: 'deck'
          },
          to: {
            source: 'hand'
          }
        }
      }));
    } : () => {}
  });

  return connect(mapStateToProps)(Deck);
})();

const getOtherPlayers = table => table.playerIDs.filter(playerID => playerID != table.me);

const Gameplay = ({
  table
}) => React.createElement("div", {
  className: "right_panel"
}, getOtherPlayers(table).map(playerID => React.createElement(PlayerSeat, {
  playerID: playerID,
  key: playerID
})), React.createElement(Discard, null), React.createElement(Deck, null), table.mode == 'round' && React.createElement(React.Fragment, null, React.createElement(MyHand, null), table.round.mode == 'accusation' && React.createElement(Accusation, null)), table.mode == 'inBetweenRounds' && React.createElement(RuleInput, null));

const mapStateToProps = state => ({
  table: state.table
});

module.exports = connect(mapStateToProps)(Gameplay);