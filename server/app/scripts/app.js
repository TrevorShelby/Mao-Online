const React = require('react');

const {
  connect
} = require('react-redux');

const Hand = require('./hand.js');

const Discard = require('./discard.js');

const OthersHandLengths = require('./othersHandLengths.js');

function App({
  tableHasRound,
  tint,
  playerID
}) {
  if (!tableHasRound && playerID == undefined) {
    return React.createElement("div", null);
  }

  if (!tableHasRound && playerID != undefined) {
    return React.createElement("div", null, React.createElement("span", {
      className: "clientName"
    }, playerID));
  }

  return React.createElement("div", {
    id: "table"
  }, React.createElement(OthersHandLengths, null), React.createElement(Discard, null), React.createElement(Hand, null), React.createElement("span", {
    className: "clientName"
  }, playerID), React.createElement("div", {
    className: "overlay",
    style: {
      backgroundColor: tint
    }
  }));
}

const mapStateToProps = state => {
  const tableExists = state != undefined && 'table' in state;
  const tableHasRound = tableExists && 'game' in state.table && 'round' in state.table.game;
  const tint = tableHasRound && state.table.game.round.mode == 'accusation' ? '#00000088' : '#00000000';
  return {
    tableHasRound,
    tint,
    playerID: tableExists ? state.table.me : undefined
  };
};

module.exports = connect(mapStateToProps)(App);