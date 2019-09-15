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
}, React.createElement("span", null, playerID), React.createElement("br", null), numCards != undefined && React.createElement("span", null, numCards));

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

const mapStateToProps = state => {
  const stateProps = {};

  if (state.table.mode == 'inBetweenRounds' || state.table.mode == 'lobby') {
    stateProps.numCardsByPlayerID = state.table.playerIDs.reduce((numCardsByPlayerID, playerID) => {
      if (playerID == state.table.me || playerID == undefined) return numCardsByPlayerID;
      return { ...numCardsByPlayerID,
        [playerID]: undefined
      };
    }, {});

    stateProps.accusePlayer_ = () => {};
  } else {
    stateProps.numCardsByPlayerID = state.table.playerIDs.reduce((numCardsByPlayerID, playerID) => {
      if (playerID == state.table.me || playerID == undefined) return numCardsByPlayerID;
      return { ...numCardsByPlayerID,
        [playerID]: state.table.round.handLengths[playerID]
      };
    }, {});

    stateProps.accusePlayer_ = playerID => () => {
      if (state.table.round.mode != 'accusation') {
        state.tableConn.send(JSON.stringify({
          type: 'action',
          name: 'accuse',
          args: playerID
        }));
      }
    };
  }

  return stateProps;
};

module.exports = connect(mapStateToProps)(OtherPlayers);