const React = require('react');

const {
  connect
} = require('react-redux');

class RuleInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "ruleInputContainer"
    }, React.createElement("span", null, "Write a new rule:"), React.createElement("input", {
      id: "ruleInput",
      type: "text",
      maxLength: "200",
      ref: inputEl => this.inputEl = inputEl,
      onKeyDown: e => {
        if (e.keyCode == 13) this.props.sendRule(this.inputEl.value);
      }
    }));
  }

}

const mapStateToProps = state => ({
  sendRule: rule => state.tableConn.send(JSON.stringify({
    type: 'action',
    name: 'writeRule',
    args: rule
  }))
});

module.exports = connect(mapStateToProps)(RuleInput);