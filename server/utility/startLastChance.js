const { sendEvent_ } = require('../sendMessage.js')



function startLastChance_(game, actionPools) {
	function startLastChance(winningSeat) {
		game.round.mode = 'lastChance'
		game.round.winner = winningSeat

		actionPools.forEach( (actionPool, poolOwnerSeat) => {
			actionPool.changeActivityByTags(
				(tags) => { return tags.includes('lastChance') }
			)
			//yes, even for the winner.
			actionPool.activate('accuseWinner')
		})

		endRoundWhenLastChancePasses(game)
	}
	return startLastChance
}




//copied reference for my tiny peabrain:
//https://dev.to/chromiumdev/cancellable-async-functions-in-javascript-5gp7
function makeSingle(generator) {
  let globalNonce;
  return async function(...args) {
    const localNonce = globalNonce = new Object();

    const iter = generator(...args);
    let resumeValue;
    for (;;) {
      const n = iter.next(resumeValue);
      if (n.done) {
        return n.value; 
      }

      resumeValue = await n.value;
      //this happens during an accuse and would await for accusation to end.
      if (localNonce !== globalNonce) {
      }
    }
  };
}


module.exports = startLastChance_