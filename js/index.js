import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers"
import {onerror,onsuccess,onupgradeneeded} from "./db"

// SERVICE WORKER NOT WEB WORKER


let store = createStore(reducer);

//Indexed Db Stuff 
var request = window.indexedDB.open("reduxStore",12)
request.onerror = onerror
request.onsuccess = onsuccess(store)
request.onupgradeneeded = onupgradeneeded
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("container")
);
