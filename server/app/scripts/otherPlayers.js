const React = require('react');

const {
  connect
} = require('react-redux');

const HandLength = ({
  playerID,
  numCards,
  onClick
}) => React.createElement("div", {
  className: "handLength",
  onClick: onClick
}, React.createElement("div", null, playerID), React.createElement("div", null, numCards));

const OtherPlayers = ({
  numCardsByPlayerID,
  accusePlayer_
}) => React.createElement("div", {
  className: "handLengths"
}, numCardsByPlayerID.map(([playerID, numCards, seat]) => React.createElement(HandLength, {
  playerID: playerID,
  numCards: numCards,
  onClick: accusePlayer_(seat),
  key: playerID
})));

const mapStateToProps = state => ({
  numCardsByPlayerID: state.table.playerIDs.reduce((numCardsByPlayerID, playerID, seat) => {
    if (playerID == state.table.me || playerID == undefined) {
      return numCardsByPlayerID;
    }

    numCardsByPlayerID.push([playerID, state.table.game.round.handLengths[seat], seat]);
    return numCardsByPlayerID;
  }, []),
  accusePlayer_: seat => () => {
    if (state.table.game.round.mode != 'accusation') {
      state.tableConn.send(JSON.stringify({
        type: 'action',
        name: 'accuse',
        args: seat
      }));
    }
  }
});

module.exports = connect(mapStateToProps)(OtherPlayers);