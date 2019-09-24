const React = require('react');

const {
  connect
} = require('react-redux');

const PlayerName = ({
  playerID,
  nameColor = 'unset'
}) => React.createElement("b", {
  style: {
    color: nameColor
  }
}, playerID);

const mapStateToProps = state => {
  if (state.playerColors != undefined) return {
    playerColors: state.playerColors
  };
  return {};
};

const mergeProps = (stateProps, _, ownProps) => {
  const props = {
    playerID: ownProps.playerID
  };
  if ('playerColors' in stateProps) props.nameColor = stateProps.playerColors[ownProps.playerID];
  return props;
};

module.exports = connect(mapStateToProps, undefined, mergeProps)(PlayerName);