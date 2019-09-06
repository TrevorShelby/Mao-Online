const React = require('react');

const {
  connect
} = require('react-redux');

const AccusationButton = ({
  endAccusation,
  text
}) => React.createElement("button", {
  className: "accusationEnder",
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

module.exports.CancelAccusationButton = connect(mapStateToProps_('cancelAccusation'))(AccusationButton);
module.exports.AcceptAccusationButton = connect(mapStateToProps_('acceptAccusation'))(AccusationButton);