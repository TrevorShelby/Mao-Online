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