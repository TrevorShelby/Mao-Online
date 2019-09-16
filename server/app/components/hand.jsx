const React = require('react')
const { connect } = require('react-redux')
const uuidv4 = require('uuid/v4')

const Card = require('./card.js')



function Hand({cardObjs, selectedCardIndex, onCardClicked_}) {
	const cardElements = cardObjs.map( ({rank, suit}, cardIndex) => {
		const isSelected = selectedCardIndex == cardIndex
		return <Card
			rank={rank} suit={suit} key={uuidv4()}
			highlight={isSelected ? 'orange' : undefined} onClick={onCardClicked_(cardIndex)}
		/>
	})
	return(
		<div id='myHand' style={{width: (cardObjs.length * 36) + 'px'}}>
			{cardElements}
		</div>
	)
}


const mapStateToProps = state => ({
	cardObjs: state.table.round.myHand,
	selectedCardIndex: state.selectedCardIndex,
	tableConn: state.tableConn,
	discardTopCardIndex: state.table.round.piles[0].cards.length,
	isHandActive: state.table.round.mode == 'play'
})


const mapDispatchToProps = dispatch => ({
	selectCard: cardIndex => dispatch({type: 'cardSelected', selectedCardIndex: cardIndex})
})


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
	cardObjs: stateProps.cardObjs,
	selectedCardIndex: stateProps.selectedCardIndex,
	onCardClicked_: cardIndex => () => {
		if(!stateProps.isHandActive) { return }
		if(cardIndex == stateProps.selectedCardIndex) {
			stateProps.tableConn.send(JSON.stringify({
				type: 'action',
				name: 'moveCard',
				args: {
					from: {source: 'hand', cardIndex: stateProps.selectedCardIndex},
					to: {source: 'pile', pileIndex: 0, cardIndex: stateProps.discardTopCardIndex}
				}
			}))
			dispatchProps.selectCard(-1)
		}
		else {
			dispatchProps.selectCard(cardIndex)
		}
	}
})



module.exports = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Hand)