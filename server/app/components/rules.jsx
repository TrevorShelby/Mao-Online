const React = require('react')
const { connect } = require('react-redux')



const RulesList = ({rules}) => (
	<div id='rulesList'>
		<span>Rules: </span>
		{rules.map( (rule, i) => (<li key={i}>{rule}</li>) )}
	</div>
)

const mapStateToProps = state => ({
	rules: state.table.rules
})



module.exports = connect(mapStateToProps)(RulesList)