import { setInitialState } from "./actions";
/* global Db object :( */
let db;

function insertTask(Task) {
  var toDoListObjectStore = db
    .transaction(["toDoList"], "readwrite")
    .objectStore("toDoList");
  return toDoListObjectStore.add(Task);
}

function deleteTask(taskId) {
  let transaction = db.transaction(["toDoList"], "readwrite");
  let toDoListObjectStore = transaction.objectStore("toDoList");
  let dbItem = toDoListObjectStore.delete(taskId);
  return dbItem;
}

function onsuccess(store) {
  return function(event) {
    db = event.target.result;
    // Store values in the newly created objectStore.
    getInitialState(store);
  };
}
function onerror(event) {
  console.log(event);
}
function reorderTask(sourceId, targetId){
  //TODO: updare task from sourceId to targetId in the Db

}
function getInitialState(store) {
  let reduxState = { tasks: [] };
  let transaction = db.transaction(["toDoList"]);
  let objectStore = transaction.objectStore("toDoList");
  objectStore.openCursor().onsuccess = event => {
    let cursor = event.target.result;
    if (cursor) {
      reduxState.tasks.push(cursor.value);
      cursor.continue();
    } else {
      store.dispatch(setInitialState(reduxState));
    }
  };
}

function onupgradeneeded(event) {
  let objectStoreNames = ["toDoList"];
  var db = event.target.result;
  try {
    objectStoreNames.map(name => db.deleteObjectStore(name));
  } catch (e) {
    console.log(e);
  }
  var objectStore = db.createObjectStore("toDoList", { keyPath: "taskId" });

  // define what data items the objectStore will contain

  objectStore.createIndex("titleTodo", "title", { unique: false });
  objectStore.createIndex("typeTodo", "taskType", { unique: false });
  objectStore.createIndex("stateTodo", "state", { unique: false });
  objectStore.createIndex("notifiedTodo", "notified", { unique: false });
}
export {
  deleteTask,
  onupgradeneeded,
  onsuccess,
  getInitialState,
  onerror,
  insertTask,
  reorderTask
};
