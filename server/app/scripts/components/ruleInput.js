const React = require('react');

const {
  connect
} = require('react-redux');

const RuleInput = ({
  writeRule
}) => React.createElement("div", {
  className: "rule_input_container"
}, React.createElement("span", null, "Enter your new rule:"), React.createElement("input", {
  className: "rule_input",
  onKeyPress: e => {
    if (e.key == 'Enter' && e.target.value != '') writeRule(e.target.value);
  }
}));

const mapStateToProps = state => ({
  writeRule: rule => state.tableConn.send(JSON.stringify({
    type: 'action',
    name: 'writeRule',
    args: rule
  }))
});

module.exports = connect(mapStateToProps)(RuleInput);