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
console.log(store)

//Indexed Db Stuff 
var request = window.indexedDB.open("reduxStore",4)

request.onerror = function(event){
  console.log(event)
  alert('why didnt you allow my web app to use IndexedDB?!')
}

// This is what our customer data looks like.
const todoData = [
  { taskId: "444-44-4444", hours: "Bill", minutes: 35, day: "bill@company.com", month:"e", year:"1234",notified:"true" },
  { taskId: "555-55-5555", hours: "Donna", minutes: 32, day: "donna@home.org", month:"e", year:"2345",notified:"false" }
];

var db;
request.onsuccess = function(event){
  db = event.target.result;
  // Store values in the newly created objectStore.
  var toDoListObjectStore = db.transaction("toDoList", "readwrite").objectStore("toDoList")
  for (var i in todoData) {
    toDoListObjectStore.add(todoData[i]);
  }
}

request.onupgradeneeded = function(event){
   var db = event.target.result
   var objectStore = db.createObjectStore("toDoList", { keyPath: "taskId" });
    
    // define what data items the objectStore will contain
    
    objectStore.createIndex("hours", "hours", { unique: false });
    objectStore.createIndex("minutes", "minutes", { unique: false });
    objectStore.createIndex("day", "day", { unique: false });
    objectStore.createIndex("month", "month", { unique: false });
    objectStore.createIndex("year", "year", { unique: false });
    objectStore.createIndex("notified", "notified", { unique: false });
}




ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("container")
);
