>The Mao API is a protocol of rules. The API documentation begins now.

This protocol requires messages to be formatted as JSON objects serialized into strings on both the client-side and server-side.

#The Game

##Turn Order
Although not strictly a part of the protocol, it is still important that there is a standard for figuring out who goes first and who goes after who. And it is up to the client application to communicate this turn order to its user. So, the player who has joined the table before all other players is the one who goes first. Clockwise from each player is the player who joined soonest after them, unless they were last to join, in which case a full rotation has been made.


##Card Groups
Cards can be in one of two card groups: hands or piles. Cards can also be retrieved or put into the deck, however, the deck itself is not card group, rather it is something that randomly generates cards (this is to prevent card-counting clients). A player can view cards that are in their own hand (each player gets one), as well as how many cards are in everyone else's hands. The other type of card group, piles, have their cards visible to all players. The first pile is always the discard pile, a pile which no player owns. Players may move cards from and to their own hand, a pile, and the deck.


##Accusation
During play, one player may accuse another (or even themselves) of breaking a rule. Play cannot continue until the accusation has been settled (players can still talk to each other though). In order for an accusation to be settled, one of two things must happen: either the accused player accepts the accusation, or the accusing playing cancels the accusation.


##Winning
For a player to win a round of Mao, they need to first play the last card from their hand. Once they do this, a timer of ten seconds begins. During this time, which is known as "last chance", players can only talk and accuse the winning player of breaking a rule. Once the timer hits zero seconds, that player wins the round. However, if a player accuses the winning player, that timer pauses. And if the winning player then accepts the accusation, they will forfeit that potential victory (they can still win later in the round). Alternatively, if the accusing player decides to cancel the accusation, the timer resumes. Once a player has won, the victorious player creates a new rule in secret, and a new round begins.



#Card Objects
Cards are described by three index properties: `value`, `rank`, and `suit`. `rank` indexes from this list:

`[ace, two, three, four, five, six, seven, eight, nine, ten, jack, queen, king]`,

and `suit` indexes from this list:

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



#Actions
A client in the game of Mao sends messages to the server in order to perform actions. For the client to perform an action, they would have to send a message that looks like this:
```JSON
{
	"type": "action",
	"name": "actionName",
	"args": {
		...
	}
}
```
`type` is always "action" for an action. `name` describes which action the client is taking. Certain actions also require an `args` property, which the client provides with any extra information about the action. Below is a section for each action, with their `name` in the title.

##The `talk` Action
The `talk` action lets the client send a chat message. `args` describes what the client is saying as a string.


##The `moveCard` Action
The `moveCard` action lets the client to move a card from one place to another. It is only available during play.
```JSON
"args": {
	"from": {
		...
	},
	"to": {
		...
	}
}
```
`from` describes where the card is being moved from, and `to` describes where it is being moved to. Both objects will *always* have a `source` property that describes the type of area that the card is being moved from or to. There is a section for each different variant for both types of objects below.

###Hand-`from` Objects
```JSON
{
	"source": "hand",
	"cardIndex": 0	
}
```
`cardIndex` describes the exact card in the client's hand that is being moved. If the cardIndex is 0, the first card in the client's hand is moved.

###Hand-`to` Objects
```JSON
{
	"source": "hand",
}
```

###Pile-`from` and -`to` Objects
```JSON
{
	"source": "pile",
	"pileIndex": 0,
	"cardIndex": 0
}
```
`pileIndex` describes the exact pile that the card is going from or to. For `from` objects, `cardIndex` describes which card is being moved from the pile. for `to` object, `cardIndex` describes which index of the pile's cards the card will be moved into. It should be noted that the `cardIndex` for a `to` object can be one index higher than the current last index of the pile's cards, which describes moving the card to the very top of the pile (or, more technically, appending the card to the pile's cards).

###Deck-`from` and -`to` Objects
```JSON
{
	"source": "deck"
}
```
Since the deck is infinite, a deck-`to` object will get rid of the card being moved.


##The `accuse` Action
The `accuse` action lets the client accuse a player of breaking a rule. It is only available during play and when a player is about to win after playing their last card. `args` describes the player being accused.


##The `acceptAccusation` Action
The `acceptAccusation` action lets an accused client accept the accusation towards them. This action does not need an `args` property.


##The `cancelAccusation` Action
The `cancelAccusation` action lets an accusing client cancel their accusation. This action does not need an `args` property.


##The `writeRule` Action
The `writeRule` action lets a client, who has just won a round, write a rule. It is only available between rounds. `args` describes a string of the rule that the client has written.



#Event Notifications
Whenever clients need to be notified through a state change, they will receive an event notification from the server. Event notifications look like this:
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
`type` is always "event" for an event notification. `name` describes the name of the event that has taken place. `order` enumerates this event among any others that the server has sent the client, where the first event has an `order` of 0, the second event has an `order` of 1, and so on. This lets the client make sure they are tracking state changes in the correct order. Finally, there is `data`, which further describes the event. Below is a section for each action, with their `name` in the title.

##The `joinedTable` Event
The `joinedTable` event is caused by the client joining the table.
```JSON
"data": {
	"you": "85670230-e0cb-4538-b50c-874759e98fd1",
	"others": [
		"a8aa2178-0259-42b3-9f51-b97d2b499397"
	]
}
```
`you` describes the client's player uuid. `others` describes the player uuids of everyone else at the table, in the order that they joined.


##The `playerJoined` Event
The `playerJoined` event is caused by another player joining the table. `data` describes the player who is joining.


##The `playerLeft` Event
The `playerLeft` event is caused by another player leaving the table. `data` describes the player who is leaving.


##The `playerTalked` Event
The `playerTalked` event is caused by a player adding to the chat log.
```JSON
"data": {
	"quote": "whatever was said",
	"by": "85670230-e0cb-4538-b50c-874759e98fd1",
	"timestamp": 1566229882915
}
```
`quote` describes that player has said. `by` describes the player who is talking. `timestamp` describes the time it was when the quote was added to the server's chat log and forwarded.


##The `roundStarted` Event
The `roundStarted` event is caused by the start of a new round.
```JSON
"data": {
	"yourHand": [
		{"value": 0, "rank": 0, "suit": 0}, ...
	],
	"discard": [
		{"value": 0, "rank": 0, "suit": 0}
	]
}
```
`yourHand` describes the hand that the client is initially dealt. It should always be seven cards long, and you can assume the same for all other players' initial hands. `discard` describes the cards in the discard pile. Although the discard pile will always start with one card, `discard` is sent as an array, as a reinforcement that client applications should keep track of all of the discard pile, instead of just the top card.


##The `roundOver` Event
The `roundOver` event is caused when the round was in last chance and the winning player won. `data` describes the player who won.


##The `cardMoved` Event
The `cardMoved` event is caused by a player moving a card from one place to another (which is done through the `moveCard` action).
```JSON
"data": {
	"card": { "value": 0, "rank": 0, "suit": 0},
	"from": { ... },
	"to": { ... },
	"by": "85670230-e0cb-4538-b50c-874759e98fd1"
}
```
The contents of `from` and `to` are dependent of where the card is going from and to. `by` describes the player who is moving the card. `card` only appears if the card was moved from or to a pile or if the message is to the client who moved the card.

###Hand-`from` and -`to` Objects
```JSON
{
	"source": "hand",
	"length": 0
}
```
`length` describes the number of cards the player has in their hand after the event.

####Hand-`from` Objects Sent to the Moving Player
A player who is moving a card from their hand gets a `from` object similar to the one above, but with a `cardIndex` property instead of a `length` property.

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
"data": {
	"accuser": "85670230-e0cb-4538-b50c-874759e98fd1",
	"accused": "a8aa2178-0259-42b3-9f51-b97d2b499397"
}
```
`accuser` describes the player who is accusing. `accused` describes the player who is being accused.


##The `accusationAccepted` Event
The `accusationAccepted` event is caused by the accused player of an accusation accepting that accusation. This event does not have a `data` property.


##The `accusationCancelled` Event
The `accusationCancelled` event is caused by the accusing player of an accusation cancelling that accusation. `data` describes the mode that the round is returning to ("play" if accusation happened during normal play, and "lastChance" if the accusation happened during a last chance).


##The `lastChanceStarted` Event
The `lastChanceStarted` event is caused by a player getting rid of the last card in their hand. It signals that there is only ten seconds left in the round unless someone accuses that player (known as the winning player).
```JSON
"data": {
	"winningPlayer": "85670230-e0cb-4538-b50c-874759e98fd1",
	"timeStarted": 1566229882915
}
```
`winningPlayer` describes the winning player. `timeStarted` describes the time it was when the countdown began.


##The `winningPlayerLeft` Event
The `winningPlayerLeft` event is caused when the round is in last chance and the winning player leaves the table. This event does not have a `data` property.


##The `ruleWritten` Event
The `ruleWritten` event is caused by the client writing a rule. `data` describes the rule that the client wrote as a string. Your client will not receive this event when it is another player that is writing the rule, so it should listen for the `roundStarted` event when waiting for the time between rounds to end. 


##The `rulesRevealed` Event
The `rulesRevealed` event is caused by a player leaving the table after they have already written at least one rule.
```JSON
"data": {
	"author": "a8aa2178-0259-42b3-9f51-b97d2b499397",
	"rules": [
		"yada yada yada yada"
	]
}
```
`author` describes the player whose rules are being revealed. `rules` are all of the rules that the player wrote.