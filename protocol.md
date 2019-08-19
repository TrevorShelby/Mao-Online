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
	"value": 29,
	"rank": 3,
	"suit": 2
}
```

##Card Groups
Cards can be in one of two card groups: hands or piles. Cards can also be retrieved or put into the deck, however, the deck itself is not card group, rather it is something that randomly generates cards (this is to prevent card-counting clients). A client can view cards that are in their own hand (each client gets one), as well as how many cards are in everyone else's hands. Clients may move cards to and from their own hand, but not anyone else's. The other type of card group, piles, have their cards visible to all clients. The first pile is always the discard pile, a pile which no player owns.

##Accusation
During play, one player may accuse another (or even themselves) of breaking a rule. Play cannot continue until the accusation has been settled (players can still talk to each other though). In order for an accusation to be settled, one of two things must happen. Either the accused player accepts the accusation, or the accusing playing cancels the accusation.


#Actions
A client in the game of Mao sends messages in order to perform actions. For the client to perform an action, they would have to send a message to the server that looks like this:

```JSON
{
	"type": "action",
	"data": {
		...
	}
}
```

##Action Data
`data` is used to describe the action that the client is taking.
```JSON
{
	"name": "actionName",
	"args": {
		...
	}
}
```

If `data` is present, it will have a `name` property with a string as the value. There is a `name` value for each different action. For instance, the action to move a card uses 'moveCard' as the `name`. The `data` object might also have `args`, which the client provides with any extra information necessary to perform the given action.


##The `talk` Action
```JSON
{
	"name": "talk",
	"args": "whatever you want to say"
}
```
The `talk` action lets the client send a chat message.


##The `moveCard` Action
```JSON
{
	"name": "moveCard",
	"args": {
		"from": {
			...
		},
		"to": {
			...
		}
	}
}
```
The `moveCard` action lets the client to move a card from one place to another. It is only available during play. `from` describes the card being moved, and `to` describes where it is being moved to. Both objects will *always* have a `source` property that describes the type of area that the card is being moved from or to.

###From the Client's Hand
```JSON
{
	"source": "hand",
	"cardIndex": 0	
}
```
The `cardIndex` describes the exact card in the client's hand that is being moved. If the cardIndex is 0, the first card in the client's hand is moved.

###To the Client's Hand
```JSON
{
	"source": "hand",
}
```

###From and To a Pile
```JSON
{
	"source": "pile",
	"pileIndex": 0,
	"cardIndex": 0
}
```
`pileIndex` describes the exact pile that the card is going from or to. For `from` objects, `cardIndex` describes which card is being moved from the pile. for `to` object, `cardIndex` describes which index of the pile's cards the card will be moved into. It should be noted that the `cardIndex` for a `to` object can be one index higher than the current last index of the pile's cards, which describes moving the card to the very top of the pile (or, more technically, appending the card to the pile's cards).

###From and To the Deck
```JSON
{
	"source": "deck"
}
```
Since the deck is infinite, a deck-`to` object will get rid of the card being moved.


##The `accuse` Action
```JSON
{
	"name": "accuse",
	"args": 0
}
```
The `accuse` action lets the client accuse a player of breaking a rule. `args` is the seat of the player being accused.


##The `acceptAccusation` Action
```JSON
{
	"name": "acceptAccusation"
}
```
The `acceptAccusation` action lets an accused client accept the accusation towards them.


##The `cancelAccusation` Action
```JSON
{
	"name": "cancelAccusation"
}
```
The `cancelAccusation` action lets an accusing client cancel their accusation.



#Event Notifications
Whenever clients need to be notified through a state change, they will receive an event notification from the server, which looks likes this:
```JSON
{
	"type": "event",
	"name": "eventName",
	"order": 0,
	"data": {
		...
	}
}
```
`name` holds the name of the event that has taken place. `order` enumerates this event among any others that the server has sent the client, where the first event has an `order` of 0, the second event has an `order` of 1, and so on. This lets the client make sure they are tracking state changes in the correct order. Finally, there is `data`, which further describes the event. The name for each event, as well as information about how their `data` object is structured (if they have one) is listed below.

##The `cardMoved` Event
The `cardMoved` event is caused by a player moving a card from one place to another (which is done through the `moveCard` action).
```JSON
{
	"card": { "value": 0, "rank": 0, "suit": 0},
	"from": { ... },
	"to": { ... },
	"by": 0
}
```
The contents of `from` and `to` are dependent of where the card is going from and to. `by` describes the seat of the player who is moving the card. `card` only appears if the card was moved from a pile.

###Hand-`from` and -`to` Objects
```JSON
{
	"source": "hand",
	"length": 0
}
```
`length` describes the number of cards the player has in their hand after the event.

###Pile-`from` and -`to` Objects
```JSON
{
	"source": "pile",
	"pileIndex": 0,
	"cardIndex": 0
}
```
Similar to pile-`from` and -`to` objects of the `moveCard` action.

###Deck-`from` and -`to` Objects
```JSON
{
	"source": "deck"
}
```


##The `playerAccused` Event
The `playerAccused` event is caused by one player accusing another player or themselves.
```JSON
{
	"accuser": 0,
	"accused": 1
}
```
`accuser` describes the seat of the player who is accusing. `accused` describes the seat of the player who is being accused.


##The `accusationAccepted` Event
The `accusationAccepted` event is caused by the accused player of an accusation accepting that accusation. This event does not need a `data` object.


##The `accusationCancelled` Event
The `accusationCancelled` event is casued by the accusing player of an accusation cancelling that accusation. This event does not need a `data` object.


##The `talk` Event
The `talk` event is caused by a player adding to the chat log.
```JSON
{
	"quote": "whatever was said",
	"by": "85670230-e0cb-4538-b50c-874759e98fd1",
	"timestamp": 1566229882915
}
```
`quote` describes that player has said. `by` is a version 4 uuid that describes the client who is talking. This will likely be changed to a different form of identification later. `timestamp` describes the time when the quote was added to the chatLog and forwarded.