const React = require('react')
const { connect } = require('react-redux')

const Nameplate = require('./nameplate.js')
const OtherPlayers = require('./otherPlayers.js')
const GameMessages = require('./gameMessages.js')
const Hand = require('./hand.js')
const Deck = require('./deck.js')
const Discard = require('./discard.js')
const Accusation = require('./accusation.js')
const RuleInput = require('./ruleInput.js')



window.onbeforeunload = () => 'You won\'t be able to rejoin this table once you leave.'
const Table = ({tableHasRound, playerHasToWriteRule, playerID}) => (
	<div id='table'>
		{playerID != undefined && (<React.Fragment>
			<Nameplate />
			<OtherPlayers />
		</React.Fragment>)}
		{tableHasRound && (<React.Fragment>
			<Deck />
			<Discard />
			<GameMessages />
			<Hand />
			<Accusation />
		</React.Fragment>)}
		{playerHasToWriteRule && <RuleInput />}
	</div>
)


const mapStateToProps = state => {
	const tableExists = state != undefined && 'table' in state
	const tableHasRound = tableExists && 'round' in state.table
	const playerHasToWriteRule = (
		tableExists && state.table.mode == 'inBetweenRounds'
		&& state.table.lastWinner == state.table.me
	)
	return {
		tableHasRound,
		playerHasToWriteRule,
		playerID: tableExists ? state.table.me : undefined
	}
}



module.exports = connect(mapStateToProps)(Table)