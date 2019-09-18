const React = require('react');

const {
  connect
} = require('react-redux');

const Nameplate = ({
  name,
  color
}) => React.createElement("span", {
  id: "nameplate",
  style: {
    color
  }
}, name);

const mapStateToProps = state => {
  const stateProps = {};
  stateProps.name = state.table.me;
  if (state.table.mode != 'lobby') stateProps.color = state.playerColors[state.table.me];
  return stateProps;
};

module.exports = connect(mapStateToProps)(Nameplate);