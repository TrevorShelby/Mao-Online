(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;

},{}],2:[function(require,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],3:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":1,"./lib/rng":2}],4:[function(require,module,exports){
const spokenRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const spokenSuits = ['♣', '♦', '♥', '♠'];

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.spokenRank = spokenRanks[this.props.rank];
    this.spokenSuit = spokenSuits[this.props.suit];
    this.color = this.props.suit == 0 || this.props.suit == 3 ? 'black' : 'red';
  }

  render() {
    let className = 'card ' + this.color;

    if (this.props.isSelected) {
      className += ' selected';
    }

    return React.createElement("div", {
      className: className,
      onClick: this.props.onClick
    }, this.spokenSuit + '\n' + this.spokenRank);
  }

}

module.exports = Card;
},{}],5:[function(require,module,exports){
const uuidv4 = require('uuid/v4');

const Card = require('./card.js');

function Discard_(tableEvents) {
  class Discard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        topCard: this.props.topCard
      };
      this.cards = [this.state.topCard]; //TODO: Add tableEvents.off equivalent when component unmounts (at roundEnded)

      tableEvents.on('cardMoved', (table, {
        from,
        to
      }) => {
        if (from.source == 'pile' && from.pileIndex == 0 || to.source == 'pile' && to.pileIndex == 0) {
          const newDiscard = table.game.round.piles[0].cards.concat([]);

          if (from.cardIndex == this.cards.length - 1 || to.cardIndex == this.cards.length) {
            this.setState({
              topCard: newDiscard[newDiscard.length - 1]
            }); //TODO: Add something to show top card being taken. Current solution won't
            //show anything if the top card was equal to the one under it.
          }

          this.cards = newDiscard;
        }
      });
    }

    render() {
      const topCard = this.state.topCard;
      return React.createElement(Card, {
        rank: topCard.rank,
        suit: topCard.suit,
        key: uuidv4()
      });
    }

  }

  return Discard;
}

module.exports = Discard_;
},{"./card.js":4,"uuid/v4":3}],6:[function(require,module,exports){
const uuidv4 = require('uuid/v4');

const Card = require('./card.js');

function Hand_(tableEvents, tableConn) {
  class Hand extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hand: this.props.startingHand.concat([]),
        selectedCardIndex: -1 //TODO: Add tableEvents.off equivalent when component unmounts (at roundEnded)

      };
      tableEvents.on('cardMoved', (table, {
        by,
        from,
        to
      }) => {
        const mySeat = table.playerIDs.indexOf(table.me);

        if (by == mySeat && from.source == 'hand') {
          this.setState({
            selectedCardIndex: -1,
            hand: table.game.round.me.hand
          });
        } else if (by == mySeat && to.source == 'hand') {
          this.setState({
            hand: table.game.round.me.hand
          });
        }

        if (from.source == 'pile' && from.pileIndex == 0 || to.source == 'pile' && to.pileIndex == 0) {
          this.topCardIndex = table.game.round.piles[0].cards.length - 1;
        }
      });
      this.topCardIndex = 0;
      this.tableConn = tableConn;
    }

    render() {
      const cardElements = this.state.hand.map((card, cardIndex) => {
        const onCardClicked = () => {
          if (this.state.selectedCardIndex == cardIndex) {
            this.tableConn.send(JSON.stringify({
              type: 'action',
              name: 'moveCard',
              args: {
                from: {
                  source: 'hand',
                  cardIndex
                },
                to: {
                  source: 'pile',
                  pileIndex: 0,
                  cardIndex: this.topCardIndex + 1
                }
              }
            }));
          } else {
            this.setState({
              selectedCardIndex: cardIndex
            });
          }
        };

        return React.createElement(Card, {
          rank: card.rank,
          suit: card.suit,
          key: uuidv4(),
          onClick: onCardClicked,
          isSelected: this.state.selectedCardIndex == cardIndex
        });
      });
      return React.createElement("div", {
        class: "myHand"
      }, cardElements);
    }

  }

  return Hand;
}

module.exports = Hand_;
},{"./card.js":4,"uuid/v4":3}],7:[function(require,module,exports){
const TableEvents = require('./tableEvents.js')
const Hand_ = require('./hand.js')
const Discard_ = require('./discard.js')


const address = 'ws://192.168.137.107:8080/?tableID=' + getParameterByName('tableID')
const tableConn = new WebSocket(address)
const tableEvents = new TableEvents(tableConn)
const Hand = new Hand_(tableEvents, tableConn)
const Discard = new Discard_(tableEvents)



// new WebSocket(address); new WebSocket(address);




//credit to: https://stackoverflow.com/a/901144
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



module.exports = { Hand, Discard, tableEvents }
},{"./discard.js":5,"./hand.js":6,"./tableEvents.js":8}],8:[function(require,module,exports){
class TableEvents {
	constructor(tableConn) {
		const table = {}
		const eventHandlers = {
			joinedTable: ({you, others}) => {
				table.me = you
				table.playerIDs = others.concat([you])
				table.chatLog = []
			},
			playerJoined: (playerID) => { table.playerIDs.push(playerID) },
			playerLeft: (playerID) => {
				const playerIndex = table.playerIDs.indexOf(playerID)
				table.playerIDs.splice(playerIndex, 1)
			},
			playerTalked: (chat) => { table.chatLog.push(chat) },
			gameStarted: () => { table.game = {inBetweenRounds: false, myRules: []} },
			roundStarted: ({discard, you: {hand, seat}}) => {
				const handLengths = table.playerIDs.map( ()=>7 )
				const piles = [{owner: undefined, cards: discard}]
				table.game.round = {mode: 'play', piles, handLengths, me: {hand, seat}}
			},
			cardMoved: ({card, from, to, by}) => {
				const movedByMe = table.game.round.me.seat == by
				if(movedByMe && from.source == 'hand') {
					table.game.round.me.hand.splice(from.cardIndex, 1)
				}
				if(movedByMe && to.source == 'hand') {
					table.game.round.me.hand.push(card)
				}

				if(!movedByMe && from.source == 'hand') {
					table.game.round.handLengths[by] = from.length
				} 
				else if(!movedByMe && to.source == 'hand') {
					table.game.round.handLengths[by] = to.length
				}

				if(from.source == 'pile') {
					table.game.round.piles[from.pileIndex].cards.splice(to.cardIndex, 1)
				}
				if(to.source == 'pile') {
					table.game.round.piles[to.pileIndex].cards.splice(to.cardIndex, 0, card)
				}
			}
		}


		this.eventCallbacks = {tableChanged: []}
		for(let eventName in eventHandlers) {
			this.eventCallbacks[eventName] = []
		}
		tableConn.onmessage = (messageEvent) => {
			const message = safeJsonParse(messageEvent.data)
			console.log(message)
			if(message.type != 'event' || !(message.name in eventHandlers)) { return }
			eventHandlers[message.name](message.data)
			if(message.name in this.eventCallbacks) {
				const tableCopy = Object.assign({}, table)
				this.eventCallbacks[message.name].forEach( 
					callback => callback(tableCopy, message.data) 
				)
				this.eventCallbacks.tableChanged.forEach( callback => callback(tableCopy) )
			}
		}
	}


	on(eventName, callback) {
		this.eventCallbacks[eventName].push(callback)
	}


	off(eventName, callback) {
		const callbackIndex = this.eventCallbacks[eventName].indexOf(callback)
		this.eventCallbacks[eventName].splice(callbackIndex, 1)
	}
}



function safeJsonParse(objStr) {
	let obj
	try {
		obj = JSON.parse(objStr)
	}
	catch(err) {
		obj = objStr
	}
	return obj
}



module.exports = TableEvents
},{}],9:[function(require,module,exports){
const { Discard, tableEvents } = require('../hookComponents.js')
require('./handTest.js')


tableEvents.on('roundStarted', (table) => {
	const topCard = table.game.round.piles[0].cards[0]
	const discardContainer = document.createElement('div')
	document.body.appendChild(discardContainer)
	ReactDOM.render(
		React.createElement(Discard, {topCard}, null),
		discardContainer
	)
})
},{"../hookComponents.js":7,"./handTest.js":10}],10:[function(require,module,exports){
const { Hand, tableEvents } = require('../hookComponents.js')


// <script src='scripts/tableEvents.js'></script>
// <script src='scripts/card.js'></script>
// <script src='scripts/hand.js'></script>
// <script src='scripts/hookComponents.js'></script>


tableEvents.on('roundStarted', (table) => {
	const hand = table.game.round.me.hand
	const handContainer = document.createElement('div')
	document.body.appendChild(handContainer)
	ReactDOM.render(
		React.createElement(Hand, {startingHand: hand}, null),
		handContainer
	)
})
},{"../hookComponents.js":7}]},{},[9]);
