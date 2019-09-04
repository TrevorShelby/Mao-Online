const React = require('react');

const {
  connect
} = require('react-redux');

const HandLength = ({
  playerID,
  numCards
}) => React.createElement("div", {
  className: "handLength"
}, React.createElement("div", {
  className: "nameplate"
}, playerID), React.createElement("div", {
  className: "handLengthDisplay"
}, numCards));

const OthersHandLengths = ({
  numCardsByPlayerID
}) => React.createElement("div", {
  className: "handLengths"
}, numCardsByPlayerID.map(([playerID, numCards]) => React.createElement(HandLength, {
  playerID: playerID,
  numCards: numCards,
  key: playerID
})));

const mapStateToProps = state => ({
  numCardsByPlayerID: state.table.playerIDs.reduce((numCardsByPlayerID, playerID, seat) => {
    if (playerID == state.table.me || playerID == undefined) {
      return numCardsByPlayerID;
    }

    numCardsByPlayerID.push([playerID, state.table.game.round.handLengths[seat]]);
    return numCardsByPlayerID;
  }, [])
});

module.exports = connect(mapStateToProps)(OthersHandLengths);