const React = require('react');

const {
  connect
} = require('react-redux');

const RulesList = ({
  rules
}) => React.createElement("div", {
  id: "rulesList"
}, React.createElement("span", null, "Rules: "), rules.map((rule, i) => React.createElement("li", {
  key: i
}, rule)));

const mapStateToProps = state => ({
  rules: state.table.rules
});

module.exports = connect(mapStateToProps)(RulesList);