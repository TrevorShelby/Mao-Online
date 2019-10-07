const React = require('react')
const { connect } = require('react-redux')

const PlayerName = require('./playerName.js')



const ChatMessage = ({chatData: {by, quote, timestamp}}) => (
	<span className='chat_message' title={new Date(timestamp).toLocaleTimeString()}>
		<PlayerName playerID={by} />: {quote}
	</span>
)

const JoinedMessage = ({joinerID}) => (
	<span className='player_joined_message'>
		<PlayerName playerID={joinerID} /> joined the table.
	</span>
)

const LeftMessage = ({disconnectorID}) => (
	<span className='player_left_message'>
		<PlayerName playerID={disconnectorID} /> left the table.
	</span>
)

const rankSymbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const suitSymbols = ['♣', '♦', '♥', '♠']
const suitColors = ['black', 'red', 'red', 'black']
const CardName = ({card: {rank, suit}={rank: undefined, suit: undefined}}) => (
	<span className='card_name' style={{color: suitColors[suit]}}>
		{suitSymbols[suit] + rankSymbols[rank]}
	</span>
)



//TODO: Fix bug where if a new card gets inserted under the cardIndex, the cardIndex doesn't get
//bumped up in compensation.
const CardPlayedToTopMessage = (() => {
	const CardPlayedToTopMessage = ({card, by, cardIndex, setDiscardCardIndex}) => (
		<span className='card_played_to_top_message'>
			<PlayerName playerID={by} /> played a <CardName card={card} />.
		</span>
	)
	const mapDispatchToProps = dispatch => ({
		setDiscardCardIndex: cardIndex => () => dispatch({type: 'setDiscardCardIndex', cardIndex})
	})
	const mergeProps = (_, dispatchProps, ownProps) => ({...dispatchProps, ...ownProps})
	return connect(undefined, mapDispatchToProps, mergeProps)(CardPlayedToTopMessage)
})()


const CardTakenMessage = ({card, by}) => (
	<span className='card_taken_message'>
		<PlayerName playerID={by} /> took the <CardName card={card} />.
	</span>
)


const ChatInput = (() => {
	const ChatInput = ({onKeyPress}) => <input className='chat_input' onKeyPress={onKeyPress} />
	const mapStateToProps = state => ({
		onKeyPress: e => {
			if(e.key == 'Enter' && e.target.value != '') {
				state.tableConn.send(JSON.stringify({type: 'action', name:'talk', args:e.target.value+''}))
				e.target.value = ''
			}
		}
	})
	return connect(mapStateToProps)(ChatInput)
})()



const messageTypeToComponent = {
	chat: ChatMessage,
	playerJoined: JoinedMessage,
	playerLeft: LeftMessage
}

const GameLog = ({gameMessages}) => (
	<div className='game_log'>
		<div className='log_area'>
			{gameMessages.slice().reverse().map( (gameMessage, index) => {
				if(gameMessage.type == 'cardMoved') {
					if(gameMessage.moveType == 'play' && gameMessage.cardIsNowTopCard)
						return <CardPlayedToTopMessage {...gameMessage} key={index}/>
					if(gameMessage.moveType == 'take')
						return <CardTakenMessage {...gameMessage} key={index} />
				}
				else
					return React.createElement(
						messageTypeToComponent[gameMessage.type],
						{...gameMessage, key: index}
					)
			})}
		</div>
		<ChatInput />
	</div>
)

const mapStateToProps = state => ({ gameMessages: state.gameMessages })



module.exports = connect(mapStateToProps)(GameLog)