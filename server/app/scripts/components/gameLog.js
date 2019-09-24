const React = require('react');

const {
  connect
} = require('react-redux');

const PlayerName = require('./playerName.js');

const ChatMessage = ({
  chatData: {
    by,
    quote,
    timestamp
  }
}) => React.createElement("span", {
  className: "chat_message",
  title: new Date(timestamp).toLocaleTimeString()
}, React.createElement(PlayerName, {
  playerID: by
}), ": ", quote);

const JoinedMessage = ({
  joinerID
}) => React.createElement("span", {
  className: "player_joined_message"
}, React.createElement(PlayerName, {
  playerID: joinerID
}), " joined the table!");

const ChatInput = (() => {
  const ChatInput = ({
    onKeyPress
  }) => React.createElement("input", {
    className: "chat_input",
    onKeyPress: onKeyPress
  });

  const mapStateToProps = state => ({
    onKeyPress: e => {
      if (e.key == 'Enter' && e.target.value != '') {
        state.tableConn.send(JSON.stringify({
          type: 'action',
          name: 'talk',
          args: e.target.value + ''
        }));
        e.target.value = '';
      }
    }
  });

  return connect(mapStateToProps)(ChatInput);
})();

const GameLog = ({
  gameMessages
}) => React.createElement("div", {
  className: "game_log"
}, React.createElement("div", {
  className: "log_area"
}, gameMessages.slice().reverse().map((gameMessage, index) => {
  if (gameMessage.type == 'chat') return React.createElement(ChatMessage, {
    chatData: gameMessage.chatData,
    key: index
  });
  if (gameMessage.type == 'playerJoined') return React.createElement(JoinedMessage, {
    joinerID: gameMessage.joinerID,
    key: index
  });
})), React.createElement(ChatInput, null));

const mapStateToProps = state => ({
  gameMessages: state.gameMessages
});

module.exports = connect(mapStateToProps)(GameLog);