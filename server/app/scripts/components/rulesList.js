const React = require('react');

const connect = require('react-redux');

class RulesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assumedRules: [],
      selfAuthoredRules: []
    };
  }

  assumeNewRule() {
    this.setState(state => ({
      assumedRules: state.assumedRules.concat('')
    }));
  }

  render() {
    return React.createElement("div", {
      className: "rules_list"
    }, this.state.assumedRules.map((rule, ruleIndex) => React.createElement("textarea", {
      className: "assumed_rule",
      defaultValue: rule,
      key: ruleIndex
    })), React.createElement("button", {
      className: "add_button",
      onClick: this.assumeNewRule.bind(this)
    }, "+"));
  }

}

module.exports = RulesList;