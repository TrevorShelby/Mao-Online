const React = require('react');

const {
  connect
} = require('react-redux');

const Hand = require('./hand.js');

const Discard = require('./discard.js');

const OtherPlayers = require('./otherPlayers.js');

const {
  CancelAccusationButton,
  AcceptAccusationButton
} = require('./accusationButtons.js');

const App = ({
  tableHasRound,
  tint,
  playerID,
  accusationState
}) => React.createElement("div", {
  id: "table"
}, playerID != undefined && React.createElement("span", {
  className: "nameplate"
}, playerID), tableHasRound && React.createElement(React.Fragment, null, React.createElement(OtherPlayers, null), React.createElement(Discard, null), React.createElement(Hand, null), React.createElement("div", {
  className: "overlay",
  style: {
    backgroundColor: tint
  }
})), accusationState == 1 && React.createElement(CancelAccusationButton, null), accusationState == 2 && React.createElement(AcceptAccusationButton, null));

const mapStateToProps = state => {
  const tableExists = state != undefined && 'table' in state;
  const tableHasRound = tableExists && 'game' in state.table && 'round' in state.table.game;
  const roundIsInAccusation = tableHasRound && state.table.game.round.mode == 'accusation'; //-1 when not in accusation, 0 if not involved in accusation, 1 if accuser, 2 if accused

  const accusationState = (() => {
    if (!roundIsInAccusation) {
      return -1;
    }

    const {
      table: {
        game: {
          round: {
            accusation,
            me: {
              seat: mySeat
            }
          }
        }
      }
    } = state;

    if (accusation.accuser == mySeat) {
      return 1;
    }

    if (accusation.accused == mySeat) {
      return 2;
    }

    return 0;
  })();

  const tint = tableHasRound && state.table.game.round.mode == 'accusation' ? '#00000088' : '#00000000';
  return {
    tableHasRound,
    playerID: tableExists ? state.table.me : undefined,
    accusationState,
    tint
  };
};

module.exports = connect(mapStateToProps)(App);