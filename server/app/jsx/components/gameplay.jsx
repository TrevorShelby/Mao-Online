const React = require('react')
const connect = require('react-redux')



const Gameplay = ({table}) => (
	
)

const mapStateToProps = state => ({
	table: state.table
})



module.exports = connect(mapStateToProps)(Gameplay)