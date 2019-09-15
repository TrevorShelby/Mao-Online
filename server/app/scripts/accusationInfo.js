const React = require('react');

const {
  connect
} = require('react-redux');

const AccusationInfo = ({
  accuser,
  accused
}) => React.createElement("span", {
  id: "accusationInfo"
}, React.createElement("b", null, accuser), " has accused ", React.createElement("b", null, accused));

const mapStateToProps = state => state.table.accusation;

module.exports = connect(mapStateToProps)(AccusationInfo);