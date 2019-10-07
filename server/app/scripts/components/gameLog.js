function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
}), " joined the table.");

const LeftMessage = ({
  disconnectorID
}) => React.createElement("span", {
  className: "player_left_message"
}, React.createElement(PlayerName, {
  playerID: disconnectorID
}), " left the table.");

const rankSymbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suitSymbols = ['♣', '♦', '♥', '♠'];
const suitColors = ['black', 'red', 'red', 'black'];

const CardName = ({
  card: {
    rank,
    suit
  } = {
    rank: undefined,
    suit: undefined
  }
}) => React.createElement("span", {
  className: "card_name",
  style: {
    color: suitColors[suit]
  }
}, suitSymbols[suit] + rankSymbols[rank]); //TODO: Fix bug where if a new card gets inserted under the cardIndex, the cardIndex doesn't get
//bumped up in compensation.


const CardPlayedToTopMessage = (() => {
  const CardPlayedToTopMessage = ({
    card,
    by,
    cardIndex,
    setDiscardCardIndex
  }) => React.createElement("span", {
    className: "card_played_to_top_message"
  }, React.createElement(PlayerName, {
    playerID: by
  }), " played a ", React.createElement(CardName, {
    card: card
  }), ".");

  const mapDispatchToProps = dispatch => ({
    setDiscardCardIndex: cardIndex => () => dispatch({
      type: 'setDiscardCardIndex',
      cardIndex
    })
  });

  const mergeProps = (_, dispatchProps, ownProps) => ({ ...dispatchProps,
    ...ownProps
  });

  return connect(undefined, mapDispatchToProps, mergeProps)(CardPlayedToTopMessage);
})();

const CardTakenMessage = ({
  card,
  by
}) => React.createElement("span", {
  className: "card_taken_message"
}, React.createElement(PlayerName, {
  playerID: by
}), " took the ", React.createElement(CardName, {
  card: card
}), ".");

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

const messageTypeToComponent = {
  chat: ChatMessage,
  playerJoined: JoinedMessage,
  playerLeft: LeftMessage
};

const GameLog = ({
  gameMessages
}) => React.createElement("div", {
  className: "game_log"
}, React.createElement("div", {
  className: "log_area"
}, gameMessages.slice().reverse().map((gameMessage, index) => {
  if (gameMessage.type == 'cardMoved') {
    if (gameMessage.moveType == 'play' && gameMessage.cardIsNowTopCard) return React.createElement(CardPlayedToTopMessage, _extends({}, gameMessage, {
      key: index
    }));
    if (gameMessage.moveType == 'take') return React.createElement(CardTakenMessage, _extends({}, gameMessage, {
      key: index
    }));
  } else return React.createElement(messageTypeToComponent[gameMessage.type], { ...gameMessage,
    key: index
  });
})), React.createElement(ChatInput, null));

const mapStateToProps = state => ({
  gameMessages: state.gameMessages
});

module.exports = connect(mapStateToProps)(GameLog);