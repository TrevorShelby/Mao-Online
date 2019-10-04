const React = require('react');

const {
  connect
} = require('react-redux');

const timerSVGs = [React.createElement("svg", {
  viewBox: "0 0 52 52"
}, React.createElement("circle", {
  cx: "26",
  cy: "26",
  r: "25"
})), React.createElement("svg", {
  viewBox: "0 0 52 52"
}, React.createElement("path", {
  fill: "black",
  stroke: "black",
  d: " M 26 1 A 25 25 0 1 0 43.7 8.3 L 26 26 "
})), React.createElement("svg", {
  viewBox: "0 0 52 52"
}, React.createElement("path", {
  fill: "black",
  stroke: "black",
  d: " M 26 1 A 25 25 0 1 0 51 26 L 26 26 "
})), React.createElement("svg", {
  viewBox: "0 0 52 52"
}, React.createElement("path", {
  fill: "black",
  stroke: "black",
  d: " M 26 1 A 25 25 0 1 0 43.7 43.7 L 26 26 "
})), React.createElement("svg", {
  viewBox: "0 0 52 52"
}, React.createElement("path", {
  fill: "black",
  stroke: "black",
  d: " M 26 1 A 25 25 0 1 0 26 51 "
})), React.createElement("svg", {
  viewBox: "0 0 52 52"
}, React.createElement("path", {
  fill: "black",
  stroke: "black",
  d: " M 26 1 A 25 25 0 0 0 8.3 43.7 L 26 26 "
})), React.createElement("svg", {
  viewBox: "0 0 52 52"
}, React.createElement("path", {
  fill: "black",
  stroke: "black",
  d: " M 26 1 A 25 25 0 0 0 1 26 L 26 26 "
})), React.createElement("svg", {
  viewBox: "0 0 52 52"
}, React.createElement("path", {
  fill: "black",
  stroke: "black",
  d: " M 26 1 A 25 25 0 0 0 8.3 8.3 L 26 26 "
})), React.createElement("svg", {
  viewBox: "0 0 52 52"
})].reverse(); //TODO: Manually reverse array

class CardMoveTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: props.timeOfLastCardMove < 0 ? -1 : (Date.now() - props.timeOfLastCardMove) / 1000
    };

    const countDown = timeLeft => {
      setTimeout(() => {
        if (timeLeft < 0) {
          countDown(this.state.timeLeft);
          this.setState(state => ({
            timeLeft: this.props.timeOfLastCardMove < 0 ? -1 : (Date.now() - this.props.timeOfLastCardMove) / 1000
          }));
        } else {
          this.setState(state => ({
            timeLeft: state.timeLeft - 100
          }));
          countDown(timeLeft - 100);
        }
      }, 100);
    };

    countDown(this.state.timeLeft);
  }

  render() {
    return React.createElement("div", {
      className: "card_move_timer"
    }, timerSVGs[Math.floor(this.state.timeLeft * 8)] || timerSVGs[0]);
  }

}

const mapStateToProps = state => ({
  timeOfLastCardMove: state.table.round.timeOfLastCardMove
});

module.exports = connect(mapStateToProps)(CardMoveTimer);