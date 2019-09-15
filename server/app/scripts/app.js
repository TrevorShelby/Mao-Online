const React = require('react');

const {
  connect
} = require('react-redux');

const Nameplate = require('./nameplate.js');

const OtherPlayers = require('./otherPlayers.js');

const Hand = require('./hand.js');

const Deck = require('./deck.js');

const Discard = require('./discard.js');

const AccusationInfo = require('./accusationInfo.js');

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
  playerID
}) => React.createElement("div", {
  id: "table"
}, playerID != undefined && React.createElement(React.Fragment, null, React.createElement(Nameplate, null), React.createElement(OtherPlayers, null)), tableHasRound && React.createElement(React.Fragment, null, React.createElement(Deck, null), React.createElement(Discard, null), React.createElement(Hand, null), React.createElement(RulesList, null), accusationState > -1 && React.createElement(React.Fragment, null, React.createElement("div", {
  id: "overlay",
  style: {
    backgroundColor: '#00000088'
  }
}), React.createElement(AccusationInfo, null)), accusationState == 1 && React.createElement(CancelAccusationButton, null), accusationState == 2 && React.createElement(AcceptAccusationButton, null)), playerHasToWriteRule && React.createElement(RuleInput, null));

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

  return {
    tableHasRound,
    playerHasToWriteRule,
    accusationState,
    playerID: tableExists ? state.table.me : undefined
  };
};

module.exports = connect(mapStateToProps)(App);