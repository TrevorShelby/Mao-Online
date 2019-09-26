const React = require('react')
const { connect } = require('react-redux')


const RuleInput = ({writeRule}) => (
	<div className='rule_input_container'>
		<span>Enter your new rule:</span>
		<input className='rule_input' onKeyPress={e => {
			if(e.key == 'Enter' && e.target.value != '') writeRule(e.target.value)
		}} />
	</div>
)

const mapStateToProps = state => ({
	writeRule: (rule) => state.tableConn.send(JSON.stringify({
		type: 'action',
		name: 'writeRule',
		args: rule
	}))
})

module.exports = connect(mapStateToProps)(RuleInput)