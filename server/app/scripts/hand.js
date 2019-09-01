function Hand_(tableEvents) {
  class Hand extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hand: this.props.startingHand.concat([])
      };
      tableEvents.on('cardMoved', (table, {
        by,
        from,
        to
      }) => {
        const mySeat = table.playerIDs.indexOf(table.me);

        if (by == mySeat && (to.source == 'hand' || from.source == 'hand')) {
          this.setState(() => {
            return {
              hand: table.game.round.me.hand
            };
          });
        }
      });
    }

    render() {
      const cardElements = this.state.hand.map(card => {
        return React.createElement(Card, {
          rank: card.rank,
          suit: card.suit,
          key: card.value
        });
      });
      return React.createElement("div", {
        class: "myHand"
      }, cardElements);
    }

  }

  return Hand;
}

const spokenRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const spokenSuits = ['♣', '♦', '♥', '♠'];

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.spokenRank = spokenRanks[this.props.rank];
    this.spokenSuit = spokenSuits[this.props.suit];
  }

  render() {
    return React.createElement("div", {
      class: "card"
    }, this.spokenSuit + '\n' + this.spokenRank);
  }

}