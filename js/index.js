import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { ADD } from "./actions";

// SERVICE WORKER NOT WEB WORKER
const initialState = {
  tasks: []
};

fetch('test.json',function(response){
  console.log('we have a response')
  var reader = response.body.getReader();
  return reader.read().then(function(result) {
    return result
   })
})
.then((sth)=>console.log(sth))
.catch(function(err) {
  console.log(err.message);
});
let store = createStore((state = initialState, action) => {
  switch (action.type) {
    case ADD:
      console.log(action)
      return {
        tasks: [
          ...state.tasks,
          {
            title: action.title,
            taskType: action.taskType,
            state: { complete: false }
          }
        ]
      };
    default:
      return state;
  }
});
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("container")
);
