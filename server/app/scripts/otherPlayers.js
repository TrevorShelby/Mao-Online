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
}, React.createElement("div", null, playerID), numCards != undefined && React.createElement("div", null, numCards));

const OtherPlayers = ({
  numCardsByPlayerID,
  accusePlayer_
}) => React.createElement("div", {
  id: "handLengths"
}, Object.keys(numCardsByPlayerID).map(playerID => React.createElement(HandLength, {
  playerID: playerID,
  numCards: numCardsByPlayerID[playerID],
  onClick: accusePlayer_(playerID),
  key: playerID
})));

const mapStateToProps = state => ({
  numCardsByPlayerID: state.table.playerIDs.reduce((numCardsByPlayerID, playerID) => {
    if (playerID == state.table.me || playerID == undefined) return numCardsByPlayerID;
    return { ...numCardsByPlayerID,
      [playerID]: state.table.round.handLengths[playerID]
    };
  }, {}),
  accusePlayer_: playerID => () => {
    if (state.table.round.mode != 'accusation') {
      state.tableConn.send(JSON.stringify({
        type: 'action',
        name: 'accuse',
        args: playerID
      }));
    }
  }
});

module.exports = connect(mapStateToProps)(OtherPlayers);