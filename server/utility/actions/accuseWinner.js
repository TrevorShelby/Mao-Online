//TODO: This function is kind of sketchy. Determine whether or not it is legitimate design. If it
//isn't, the correct course of action might be changing how accuse works.
function accuseWinner_({round}, accuse) {
	function accuseWinner() {
		accuse(round.winner)
	}
	return accuseWinner
}



module.exports = accuseWinner_