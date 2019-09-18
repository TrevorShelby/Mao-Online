const React = require('react');

const {
  connect
} = require('react-redux');

const {
  CancelAccusationButton,
  AcceptAccusationButton
} = (() => {
  const AccusationButton = ({
    endAccusation,
    text
  }) => React.createElement("button", {
    id: "accusationEnder",
    onClick: endAccusation
  }, text);

  const mapStateToProps_ = actionName => state => ({
    endAccusation: () => {
      state.tableConn.send(JSON.stringify({
        type: 'action',
        name: actionName
      }));
    },
    text: actionName == 'cancelAccusation' ? 'Cancel Penalty' : 'Accept Penalty'
  });

  return {
    CancelAccusationButton: connect(mapStateToProps_('cancelAccusation'))(AccusationButton),
    AcceptAccusationButton: connect(mapStateToProps_('acceptAccusation'))(AccusationButton)
  };
})();

const AccusationInfo = (() => {
  const AccusationInfo = ({
    accuser,
    accused
  }) => React.createElement("span", {
    id: "accusationInfo"
  }, React.createElement("b", null, accuser), " has accused ", React.createElement("b", null, accused));

  return connect(state => state.table.accusation)(AccusationInfo);
})();

const Accusation = ({
  accusationState
}) => React.createElement(React.Fragment, null, accusationState > -1 && React.createElement(React.Fragment, null, React.createElement("div", {
  id: "overlay",
  style: {
    backgroundColor: '#00000088'
  }
}), React.createElement(AccusationInfo, null)), accusationState == 1 && React.createElement(CancelAccusationButton, null), accusationState == 2 && React.createElement(AcceptAccusationButton, null));

const mapStateToProps = state => {
  const roundIsInAccusation = state.table.round.mode == 'accusation'; //-1 when not in accusation, 0 if not involved in accusation, 1 if accuser, 2 if accused

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
    accusationState
  };
};

module.exports = connect(mapStateToProps)(Accusation);