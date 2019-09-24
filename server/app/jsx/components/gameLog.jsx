const React = require('react')
const { connect } = require('react-redux')

const PlayerName = require('./playerName.js')



const ChatMessage = (() => {
	const ChatMessage = ({author, quote}) => (
		<span className='chat_message'><PlayerName playerID={author} />: {quote}</span>
	)
	return (ChatMessage)
})()

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
					return <ChatMessage author={gameMessage.by} quote={gameMessage.quote} key={index} />
			})}
		</div>
		<ChatInput />
	</div>
)

const mapStateToProps = state => ({ gameMessages: state.gameMessages })



module.exports = connect(mapStateToProps)(GameLog)