>The Mao API is a protocol of rules. The API documentation begins now.

This protocol requires messages to be formatted as JSON objects serialized into strings on both the client-side and server-side.

#The Game

##Card Objects
Cards are described by three index properties: `value`, `rank`, and `suit`. The `rank` property indexes from this list:

`[ace, two, three, four, five, six, seven, eight, nine, ten, jack, queen, king]`,

and the `suit` property indexes from this list:

`[clubs, diamonds, hearts, spades]`.

`value` is an index of the whole, where a `value` of 0 would be an ace of clubs, and a `value` of 13 would be an ace of diamonds.

A card object for the four of hearts would look like this:
```JSON
{
	value: 29,
	rank: 3,
	suit: 2
}
```

##Card Groups
Cards can be in one of two card groups: hands or piles. Cards can also be retrieved or put into the deck, however, the deck itself is not card group, rather it is something that randomly generates cards. A client can view cards that are in their own hand (each client gets one), as well as how many cards are in everyone else's hands. Clients may move cards to and from their own hand, but not anyone else's. The other type of card group, piles, have their cards visible to all clients. The first pile is always the discard pile, a pile which no player owns.


#Actions
A client in a game of Mao sends messages in order to perform actions. For the client to perform an action, they would send a message to the server that looks like this:

```JSON
{
	type: "action",
	ackUID: 0,
	data: {
		...
	}
}
```

The `ackUID` property should be a numeric identifier that is unique from any other values previously used for the `ackUID` property. The acknowledgement message that server sends back to the client will carry an `ackUID` property with the same value, allowing the client to know which of their message are being acknowledged.


###Action Data
The `data` property is used to describe the action that the client is taking.
```JSON
{
	name: "actionName",
	args: {
		...
	}
}
```

If the `data` property is present, it will have a `name` property with a string as the value. There is a `name` value for each different action. For instance, the action to move a card uses 'moveCard' as the `name` value. There may also be an `args` property, which the client provides with any extra information necessary to perform the given action.


##The `moveCard` Action
```JSON
{
	name: "moveCard",
	args: {
		from: {
			...
		},
		to: {
			...
		}
	}
}
```
The `moveCard` action allows the client to move a card from one place to another. The `from` object describes the card being moved, and the `to` object describes where it is being moved to. Both objects will *always* have a `source` property that specifies the location the card is going from or to.

###`From` Objects
####From the Client's Hand
```JSON
{
	source: "hand",
	cardIndex: 0	
}
```
The `cardIndex` specifies the exact card in the client's hand that is being moved. If the cardIndex is 0, the first card in the client's hand is moved.

####From a Pile
```JSON
{
	source: "pile",
	pileIndex: 0,
	cardIndex: 0
}
```
The `pileIndex` specifies the exact pile that the card is in. Like the previous `from` object, the `cardIndex` property describes which card in the given pile is being moved.

####From the Deck
```JSON
{
	source: "deck"
}
```

###`To` Objects
####To the Client's Hand
```JSON
{
	source: "hand",
}
```
(Note: if a `moveCard` action uses both a hand-`from` and -`to` object, the message will not be acknowledged.)

####To a Pile
```JSON
{
	source: "pile",
	pileIndex: 0,
	cardIndex: 0
}
```
Works similarly to pile-`from` objects. The `cardIndex` property has to be an available index within the pile, or has to be the index after the last one available (which will put the card at the top of the pile).

####To the Deck
```JSON
{
	source: "deck"
}
```
Since the deck is infinite, a deck-`to` object will get rid of the card being moved.
(Note: Like with hand-`from` and -`to` objects, `moveCard` actions with deck-`from` and -`to` objects will not be acknowledged.)


##The `talk` Action
```JSON
{
	name: "talk",
	args: "whatever you want to say"
}
```
The `talk` action sends a chat message.



#Acknowledgements
When the server gets a valid message from a client, it will send back an acknowledgement of that message. Acknowledgements look like this:
```JSON
{
	type: "ack",
	ackUID: 0,
	order: 0,
	data: {
		...
	}
}
```
The `ackUID` of this message, as previously stated, matches with the `ackUID` of a previous client message, indicating that it is that message that the server is responding to. The `order` enumerates each server message meant to update the client of a change. The first server message carrying an update will have a value of 0 for `order`, the next will have a value of 1, and so on. Since `order` is a property of any server message carrying a state change, `order` is not just a property of acknowledgments, but a property of event notifications as well (which are discussed further down). The `order` property is a necessary piece of information for the client to ensure that they are parsing each change in the correct order. Finally, if the `data` property exists, it carries any information that the client would expect to receive from sending the message that is being acknowledged.


##Acknowledgement Data for Different Actions
If an action is left out, it is safe to assume that there will not be any `data` for that message.

###`moveCard` Actions with a Hand-`to` Object
```JSON
{
	card: { value: 0, rank: 0, suit: 0},
	cardIndex: 0
}
```
`card` describes the card being placed into the client's hand, and `cardIndex` describes the index that the card has been appended to. Placing a card in your hand while holding seven cards would give an acknowledgement with a `cardIndex` of 7.

###`moveCard` Actions with a Pile- or Deck-`to` Object
```JSON
{
	card: { value: 0, rank: 0, suit: 0 }
}
```


#Event Notifications
Whenever clients need to be notified through a state change, they will receive a message from the server. The client responsible for the state change (if there is one) gets sent an acknowledgement. All other players get sent an event notification, which looks like this:
```JSON
{
	type: "event",
	name: "eventName",
	order: 0,
	data: {
		...
	}
}
```

##Event Data For Different Actions

###`cardMoved` Actions
```JSON
{
	card: { value: 0, rank: 0, suit: 0},
	from: { ... },
	to: { ... },
	by: 0
}
```
The contents of `from` and `to` are dependent of their original sources. `by` describes the seat which took the action. `card` appears only if the card was moved from a pile.

####Hand-`from` and -`to` Objects
```JSON
{
	source: "hand",
	length: 0
}
```
`length` describes how many cards are left in the hand of the client who moved the card.

####Pile-`from` and -`to` Objects
```JSON
{
	source: "pile",
	pileIndex: 0,
	cardIndex: 0
}
```

####Deck-`from` and -`to` Objects
```JSON
{
	source: "deck"
}
```