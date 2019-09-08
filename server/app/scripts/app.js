const React = require('react');

const {
  connect
} = require('react-redux');

const Hand = require('./hand.js');

const Deck = require('./deck.js');

const Discard = require('./discard.js');

const OtherPlayers = require('./otherPlayers.js');

const {
  CancelAccusationButton,
  AcceptAccusationButton
} = require('./accusationButtons.js');

const RuleInput = require('./ruleInput.js');

const RulesList = require('./rules.js');

const App = ({
  tableHasRound,
  playerHasToWriteRule,
  accusationState,
  playerID,
  tint
}) => React.createElement("div", {
  id: "table"
}, playerID != undefined && React.createElement("span", {
  id: "nameplate"
}, playerID), tableHasRound && React.createElement(React.Fragment, null, React.createElement(OtherPlayers, null), React.createElement(Deck, null), React.createElement(Discard, null), React.createElement(Hand, null), React.createElement(RulesList, null), React.createElement("div", {
  id: "overlay",
  style: {
    backgroundColor: tint
  }
}), accusationState == 1 && React.createElement(CancelAccusationButton, null), accusationState == 2 && React.createElement(AcceptAccusationButton, null)), playerHasToWriteRule && React.createElement(RuleInput, null));

const mapStateToProps = state => {
  const tableExists = state != undefined && 'table' in state;
  const tableHasRound = tableExists && 'round' in state.table;
  const playerHasToWriteRule = tableExists && state.table.mode == 'inBetweenRounds' && state.table.lastWinner == state.table.me;
  const roundIsInAccusation = tableHasRound && state.table.round.mode == 'accusation'; //-1 when not in accusation, 0 if not involved in accusation, 1 if accuser, 2 if accused

  const accusationState = (() => {
    if (!roundIsInAccusation) return -1;
    const {
      table: {
        accusation,
        me
      }
    } = state;
    if (accusation.accuser == me) return 1;
    if (accusation.accused == me) return 2;
    return 0;
  })();

  const tint = roundIsInAccusation ? '#00000088' : '#00000000';
  return {
    tableHasRound,
    playerHasToWriteRule,
    accusationState,
    playerID: tableExists ? state.table.me : undefined,
    tint
  };
};

module.exports = connect(mapStateToProps)(App);