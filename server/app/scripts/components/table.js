const React = require('react');

const {
  connect
} = require('react-redux');

const PlayerName = require('./playerName.js');

const GameLog = require('./gameLog.js');

const Nameplate = (() => {
  const Nameplate = ({
    myName
  }) => React.createElement("span", {
    className: "nameplate"
  }, React.createElement(PlayerName, {
    playerID: myName
  }));

  const mapStateToProps = state => ({
    myName: state.table.me
  });

  return connect(mapStateToProps)(Nameplate);
})();

const Table = ({
  tableExists
}) => React.createElement("div", {
  className: "table"
}, tableExists && React.createElement("div", {
  className: "left_panel"
}, React.createElement(Nameplate, null), React.createElement(GameLog, null)));

const mapStateToProps = state => ({
  tableExists: state.table != undefined
});

module.exports = connect(mapStateToProps)(Table);