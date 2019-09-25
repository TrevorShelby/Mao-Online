const React = require('react');

const {
  connect
} = require('react-redux');

const uuidv4 = require('uuid/v4');

const Card = require('./card.js');

const PlayerSeat = require('./playerSeat.js');

const getWidth = numCards => 'calc((1.5em + 2px + 4px) * ' + numCards + ')';

const MyHand = (() => {
  const VisibleHand = ({
    cards
  }) => React.createElement("div", {
    className: "my_hand",
    style: {
      fontSize: 'large',
      width: getWidth(cards.length)
    }
  }, cards.map(card => React.createElement(Card, {
    card: card,
    key: uuidv4()
  })));

  const mapStateToProps = state => ({
    cards: state.table.round.myHand
  });

  return connect(mapStateToProps)(VisibleHand);
})();

const getOtherPlayers = table => table.playerIDs.filter(playerID => playerID != table.me);

const Gameplay = ({
  table
}) => React.createElement("div", {
  className: "right_panel"
}, getOtherPlayers(table).map(playerID => React.createElement(PlayerSeat, {
  playerID: playerID,
  key: playerID
})), table.mode == 'round' && React.createElement(MyHand, null));

const mapStateToProps = state => ({
  table: state.table
});

module.exports = connect(mapStateToProps)(Gameplay);