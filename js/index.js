import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { onerror, onsuccess, onupgradeneeded } from './db';
import registerSw from './swRegistration';
// register a sw
if ('serviceWorker' in navigator) {
  window.addEventListener('load', registerSw);
}
// Redux chrome extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// SERVICE WORKER NOT WEB WORKER

let store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

//Indexed Db
var request = window.indexedDB.open('reduxStore', 19);
request.onerror = onerror;
request.onsuccess = onsuccess(store);
request.onupgradeneeded = onupgradeneeded;
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('container')
);
