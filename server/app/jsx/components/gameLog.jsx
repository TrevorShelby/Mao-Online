const React = require('react')
const { connect } = require('react-redux')

const PlayerName = require('./playerName.js')



const ChatMessage = ({chatData: {by, quote, timestamp}}) => (
	<span className='chat_message' title={new Date(timestamp).toLocaleTimeString()}>
		<PlayerName playerID={by} />: {quote}
	</span>
)

const JoinedMessage = ({joinerID}) => (
	<span className='player_joined_message'><PlayerName playerID={joinerID} /> joined the table!</span>
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



const GameLog = ({gameMessages}) => (
	<div className='game_log'>
		<div className='log_area'>
			{gameMessages.slice().reverse().map( (gameMessage, index) => {
				if(gameMessage.type == 'chat')
					return <ChatMessage chatData={gameMessage.chatData} key={index} />
				if(gameMessage.type == 'playerJoined')
					return <JoinedMessage joinerID={gameMessage.joinerID} key={index} />
			})}
		</div>
		<ChatInput />
	</div>
)

const mapStateToProps = state => ({ gameMessages: state.gameMessages })



module.exports = connect(mapStateToProps)(GameLog)