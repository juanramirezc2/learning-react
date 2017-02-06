import React from 'react'
import ReactDOM  from 'react-dom';
import App from './components/app';
import { createStore} from  'redux';
import { Provider } from 'react-redux';

let store = createStore((state=[{title:"test2",type:"task",state:"task"}], action)=>{
    return state;
  })
ReactDOM.render(
  <Provider  store={store}>
  <App/>
  </Provider>, document.getElementById("container"));
