const React = require('react')
const { render } = require('react-dom')
const { createStore } = require('redux')
const { Provider } = require('react-redux')

const App = require('./app.js')
const rootReducer = require('./reducers.js')
const hookStoreToTable = require('./actions.js')
const { createNewSocket } = require('./config.js')



const store = createStore(rootReducer, {table: undefined})
hookStoreToTable(store.dispatch.bind(store))
render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.body
)



createNewSocket(0)