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
			playerTalked: (chat) => {table.chatLog.push(chat)},
			gameStarted: () => {table.game = {}},
			roundStarted: ({discard, you: {hand, seat}}) => {
				const handLengths = table.playerIDs.map( ()=>7 )
				const piles = [{owner: undefined, cards: discard}]
				table.game.round = {piles, handLengths, me: {hand, seat}}
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


		this.eventCallbacks = {}
		for(let eventName in eventHandlers) {
			this.eventCallbacks[eventName] = []
		}
		this.table = table
		tableConn.onmessage = (messageEvent) => {
			const message = safeJsonParse(messageEvent.data)
			console.log(message)
			if(message.type != 'event' || !(message.name in eventHandlers)) { return }
			eventHandlers[message.name](message.data)
			if(message.name in this.eventCallbacks) {
				this.eventCallbacks[message.name].forEach( 
					callback => callback(this.table, message.data) 
				)
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