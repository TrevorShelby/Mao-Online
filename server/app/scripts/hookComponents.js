const address = 'ws://192.168.137.107:8080/?tableID=' + getParameterByName('tableID')
const tableEvents = new TableEvents(new WebSocket(address))


const table = {}
tableEvents.on('joinedTable', ({you, others}) => {
	table.me = you
	table.playerIDs = others.concat([you])
	table.chatLog = []
})
tableEvents.on('playerJoined', (playerID) => { table.playerIDs.push(playerID) })
tableEvents.on('playerLeft', (playerID) => {
	const playerIndex = table.playerIDs.indexOf(playerID)
	table.playerIDs.splice(playerIndex, 1)
})
tableEvents.on('playerTalked', (chat) => {table.chatLog.push(chat)})
tableEvents.on('gameStarted', () => {table.game = {}})
tableEvents.on('roundStarted', ({discard, seating, you: {hand, seat}}) => {
	const handLengths = seating.map( ()=>7 )
	const piles = [{owner: undefined, cards: discard}]
	table.game.round = {piles, seating, handLengths, me: {hand, seat}}
})
tableEvents.on('cardMoved', ({card, from, to, by}) => {
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
		table.game.round.piles[to.pileIndex].cards[to.cardIndex].push(card)
	}
})


const Hand = (() => {
	let cardAddedToHandListener
	let cardRemovedFromHandListener 
	tableEvents.on('cardMoved', ({card, from, to, by}) => {
		const mySeat = table.game.round.seating.indexOf(table.me)
		if(by != mySeat) { return }

		if(to.source == 'hand') {
			cardAddedToHandListener(card, to.cardIndex)
		}
		else if(from.source == 'hand') {
			cardRemovedFromHandListener(from.cardIndex)
		}
		else { return }
	})
	const setOnCardAddedToHand = (onCardAddedToHand) => {
		cardAddedToHandListener = onCardAddedToHand
	}
	const setOnCardRemovedFromHand = (onCardRemovedFromHand) => {
		cardRemovedFromHandListeners = onCardRemovedFromHand
	}
	return new Hand_(setOnCardAddedToHand, setOnCardRemovedFromHand)
})()




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