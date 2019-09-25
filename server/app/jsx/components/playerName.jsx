const React = require('react')
const { connect } = require('react-redux')



const PlayerName = ({playerID, nameColor='unset', style, ...otherProps}) => (
	<b style={{color: nameColor, ...style}} {...otherProps}>{playerID}</b>
)

const mapStateToProps = state => {
	if(state.playerColors != undefined) return { playerColors: state.playerColors }
	return {}
}
const mergeProps = (stateProps, _, ownProps) => {
	const props = { ...ownProps }
	if('playerColors' in stateProps) props.nameColor = stateProps.playerColors[ownProps.playerID]
	return props
}


module.exports = connect(mapStateToProps, undefined, mergeProps)(PlayerName)