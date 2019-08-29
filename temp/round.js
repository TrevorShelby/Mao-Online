//TODO: Rework so that there can be multiple rounds (necessary for multiple tables).
const rounds = {
	hands: [],
	piles: [{owner: undefined, cards: []}]
}


module.exports = round