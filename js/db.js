import { setInitialState } from './actions';
/* global Db object :( */
let db;

function insertTask(Task) {
  var toDoListObjectStore = db
    .transaction(['toDoList'], 'readwrite')
    .objectStore('toDoList');
  return toDoListObjectStore.add(Task);
}

function deleteTask(taskId) {
  let transaction = db.transaction(['toDoList'], 'readwrite');
  let toDoListObjectStore = transaction.objectStore('toDoList');
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
function reorderTask(sourceId, targetId) {
  //TODO:
  let transaction = db.transaction(['toDoList'], 'readwrite');
  let objectStore = transaction.objectStore('toDoList');
  //TODO create the order index
  let myIndex = objectStore.index('order');
  myIndex.openCursor.onsuccess = function(event) {
    var cursor = event.target.result;
    //cursor ordered by the order index ;)
    if(cursor){
      console.log(cursor.value)
      cursor.continue()
    }
  };

  console.log(objectStore.get(sourceId), objectStore.get(targetId));
  return transaction;
}
function getInitialState(store) {
  let reduxState = { tasks: [] };
  let transaction = db.transaction(['toDoList']);
  let objectStore = transaction.objectStore('toDoList');
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
  let objectStoreNames = ['toDoList'];
  var db = event.target.result;
  try {
    objectStoreNames.map(name => db.deleteObjectStore(name));
  } catch (e) {
    console.log(e);
  }
  var objectStore = db.createObjectStore('toDoList', { keyPath: 'taskId' });

  // define what data items the objectStore will contain

  objectStore.createIndex('titleTodo', 'title', { unique: false });
  objectStore.createIndex('typeTodo', 'taskType', { unique: false });
  objectStore.createIndex('stateTodo', 'state', { unique: false });
  objectStore.createIndex('notifiedTodo', 'notified', { unique: false });
  objectStore.createIndex('order', 'order', { unique: true });
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
