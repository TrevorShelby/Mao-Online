const React = require('react');

const {
  connect
} = require('react-redux');

const Hand = require('./hand.js');

const Discard = require('./discard.js');

const OthersHandLengths = require('./othersHandLengths.js');

function App({
  isInRound,
  playerID
}) {
  if (!isInRound && playerID == undefined) {
    return React.createElement("div", null);
  }

  if (!isInRound && playerID != undefined) {
    return React.createElement("div", null, React.createElement("span", {
      className: "clientName"
    }, playerID));
  }

  return React.createElement("div", {
    id: "table"
  }, React.createElement(OthersHandLengths, null), React.createElement(Discard, null), React.createElement(Hand, null), React.createElement("span", {
    className: "clientName"
  }, playerID));
}

const mapStateToProps = state => ({
  isInRound: state != undefined && 'table' in state && 'game' in state.table && 'round' in state.table.game,
  playerID: state != undefined && 'table' in state ? state.table.me : undefined
});

module.exports = connect(mapStateToProps)(App);