const React = require('react')
const { connect } = require('react-redux')


const AccusationInfo = ({accuser, accused}) => (
	<span id='accusationInfo'><b>{accuser}</b> has accused <b>{accused}</b></span>
)

const mapStateToProps = state => state.table.accusation



module.exports = connect(mapStateToProps)(AccusationInfo)