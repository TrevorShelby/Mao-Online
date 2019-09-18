const React = require('react')
const { connect } = require('react-redux')



class RuleInput extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (<div id='ruleInputContainer'>
			<span>Write a new rule:</span>
			<input id='ruleInput' type='text' maxLength='200'
				ref={inputEl => this.inputEl = inputEl}
				onKeyDown={ (e)=>{if(e.keyCode == 13) this.props.sendRule(this.inputEl.value)} }
			/>
		</div>)
	}
}

const mapStateToProps = state => ({
	sendRule: rule => state.tableConn.send(JSON.stringify({
		type: 'action',
		name: 'writeRule',
		args: rule
	}))
})



module.exports = connect(mapStateToProps)(RuleInput)