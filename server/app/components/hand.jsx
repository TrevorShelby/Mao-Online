const React = require('react')
const { connect } = require('react-redux')
const uuidv4 = require('uuid/v4')

const Card = require('./card.js')



function Hand({cardObjs, selectedCardIndex, onCardClicked_}) {
	const cardElements = cardObjs.map( ({rank, suit}, cardIndex) => {
		const isSelected = selectedCardIndex == cardIndex
		return <Card
			rank={rank} suit={suit} key={uuidv4()}
			isSelected={isSelected} onClick={onCardClicked_(cardIndex)}
		/>
	})
	return(
		<div className='myHand' style={{width: (cardObjs.length * 33) + 'px'}}>
			{cardElements}
		</div>
	)
}


const mapStateToProps = state => ({
	cardObjs: state.table.game.round.me.hand,
	selectedCardIndex: state.selectedCardIndex,
	tableConn: state.tableConn,
	discardTopCardIndex: state.table.game.round.piles[0].cards.length
})


const mapDispatchToProps = dispatch => ({
	selectCard_: cardIndex => () => dispatch({type: 'selectCard', selectedCardIndex: cardIndex})
})


const mergeProps = (stateProps, dispatchProps, ownProps) => ({
	cardObjs: stateProps.cardObjs,
	selectedCardIndex: stateProps.selectedCardIndex,
	onCardClicked_: cardIndex => {
		if(cardIndex == stateProps.selectedCardIndex) {
			return () => {
				stateProps.tableConn.send(JSON.stringify({
					type: 'action',
					name: 'moveCard',
					args: {
						from: {source: 'hand', cardIndex: stateProps.selectedCardIndex},
						to: {source: 'pile', pileIndex: 0, cardIndex: stateProps.discardTopCardIndex}
					}
				}))
				dispatchProps.selectCard_(-1)()
			}
		}
		else {
			return dispatchProps.selectCard_(cardIndex)
		}
	}
})



module.exports = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Hand)