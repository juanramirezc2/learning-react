import { setInitialState } from "./actions"
/* global Db object :( */
let db;

function insertTask(Task) {
  // This is what our customer data looks like.
  const todoData = [
    { taskId: "444-44-4444", title: "do something", type: "task", state: "uncomplete", notified: "true" },
    { taskId: "555-55-5555", title: "go somewhere", type: "event", state: "uncomplete", notified: "false" }
  ];
  var toDoListObjectStore = db.transaction(["toDoList"], "readwrite").objectStore("toDoList")
  return toDoListObjectStore.add(Task);
}

function onsuccess(store) {
  return function (event){
    db = event.target.result;
    // Store values in the newly created objectStore.
    getInitialState(store)
  }
}
function onerror(event) {
  console.log(event)
}

function getInitialState(store) {
  let reduxState = { tasks: [] };
  let transaction = db.transaction(["toDoList"])
  let objectStore = transaction.objectStore("toDoList")
  objectStore.openCursor().onsuccess = (event) => {
    let cursor = event.target.result
    if (cursor) {
      reduxState.tasks.push(cursor.value)
      cursor.continue();
    }
    else {
      store.dispatch(setInitialState(reduxState))
      console.log(store.getState())
    }
  }
}


function onupgradeneeded(event) {
  let objectStoreNames = ["toDoList"]
  var db = event.target.result
  objectStoreNames.map((name) => db.deleteObjectStore(name))
  var objectStore = db.createObjectStore("toDoList", { keyPath: "taskId" });

  // define what data items the objectStore will contain

  objectStore.createIndex("titleTodo", "title", { unique: false });
  objectStore.createIndex("typeTodo", "taskType", { unique: false });
  objectStore.createIndex("stateTodo", "state", { unique: false });
  objectStore.createIndex("notifiedTodo", "notified", { unique: false });
}
export { onupgradeneeded, onsuccess, getInitialState, onerror, insertTask }