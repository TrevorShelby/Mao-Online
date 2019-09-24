const React = require('react')
const { connect } = require('react-redux')

const PlayerName = require('./playerName.js')
const GameLog = require('./gameLog.js')


const Nameplate = (()=>{
	const Nameplate = ({myName}) => <span className='nameplate'><PlayerName playerID={myName} /></span>
	const mapStateToProps = state => ({myName: state.table.me})
	return connect(mapStateToProps)(Nameplate)
})()

const Table = ({tableExists}) => (
	<div className='table'>
		{tableExists &&
		<div className='left_panel'>
			<Nameplate />
			<GameLog />
		</div>
		}
	</div>
)

const mapStateToProps = state => ({ tableExists: state.table != undefined })



module.exports = connect(mapStateToProps)(Table)