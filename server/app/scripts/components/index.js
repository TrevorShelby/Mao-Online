const React = require('react'); //gets rid of "Download the React DevTools for a better development experience" console message
//credit to: https://stackoverflow.com/a/42196820


__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  supportsFiber: true,
  inject: function () {},
  onCommitFiberRoot: function () {},
  onCommitFiberUnmount: function () {}
};

const {
  render
} = require('react-dom');

const {
  createStore
} = require('redux');

const {
  Provider
} = require('react-redux');

const App = require('./components/app.js');

const rootReducer = require('./reducers.js');

const hookStoreToTable = require('./hookStoreToTable.js');

const {
  createSocket
} = require('./config.js');

const appContainer = document.createElement('div');
appContainer.style = '{width: 100%; height: 100%;}';
document.body.append(appContainer); //Adds websocket connection to state.

const store = createStore(rootReducer, {});
const tableConn = hookStoreToTable(store.dispatch.bind(store));
render(React.createElement(Provider, {
  store: store
}, React.createElement(App, null)), appContainer);