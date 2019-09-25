function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const React = require('react');

const {
  connect
} = require('react-redux');

const PlayerName = ({
  playerID,
  nameColor = 'unset',
  style,
  ...otherProps
}) => React.createElement("b", _extends({
  style: {
    color: nameColor,
    ...style
  }
}, otherProps), playerID);

const mapStateToProps = state => {
  if (state.playerColors != undefined) return {
    playerColors: state.playerColors
  };
  return {};
};

const mergeProps = (stateProps, _, ownProps) => {
  const props = { ...ownProps
  };
  if ('playerColors' in stateProps) props.nameColor = stateProps.playerColors[ownProps.playerID];
  return props;
};

module.exports = connect(mapStateToProps, undefined, mergeProps)(PlayerName);