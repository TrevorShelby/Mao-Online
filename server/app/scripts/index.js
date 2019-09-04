const React = require('react');

const {
  render
} = require('react-dom');

const {
  createStore
} = require('redux');

const {
  Provider
} = require('react-redux');

const App = require('./app.js');

const rootReducer = require('./reducers.js');

const hookStoreToTable = require('./hookStoreToTable.js');

const {
  createSocket
} = require('./config.js');

const store = createStore(rootReducer, {});
const tableConn = hookStoreToTable(store.dispatch.bind(store));
store.dispatch({
  type: 'connectionMade',
  tableConn
});
render(React.createElement(Provider, {
  store: store
}, React.createElement(App, null)), document.body); // createSocket(0)