import { setInitialState } from './actions';
/* global Db object :( */
let db;

function insertTask(Task) {
  let insertTransaction = db.transaction(['toDoList'], 'readwrite');
  let todoListObjectStore = insertTransaction.objectStore('toDoList');
  todoListObjectStore.add(Task);
  return insertTransaction;
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
function reorderTask(sourceInfo, targetInfo) {
  let transaction = db.transaction(['toDoList'], 'readwrite');
  let objectStore = transaction.objectStore('toDoList');

  objectStore.get(sourceInfo.id).onsuccess = ({ target }) => {
    let sourceTask = target.result;
    sourceTask.order = targetInfo.order;
    console.log('source task modified', sourceTask);
    objectStore.put(sourceTask);
  };
  objectStore.get(targetInfo.id).onsuccess = ({ target }) => {
    let targetTask = target.result;
    targetTask.order = sourceInfo.order;
    console.log('target task modified', targetTask);
    objectStore.put(targetTask);
  };
  return transaction;
}

/* get all the task from indexedDB this method will be call everytime redux state needs an update */
function getAllData() {
  let transaction = db.transaction(['toDoList']);
  let objectStore = transaction.objectStore('toDoList');
  let orderIndex = objectStore.index('order');
  let allData = [];
  return new Promise((resolve, reject) => {
    orderIndex.openCursor().onsuccess = ({ target }) => {
      let cursor = target.result;
      if (cursor) {
        allData.push(cursor.value);
        cursor.continue();
      } else {
        resolve(allData);
      }
    };
  });
}

async function getInitialState(store) {
  let allData = await getAllData();
  store.dispatch(setInitialState(allData));
}

function onupgradeneeded(event) {
  let objectStoreNames = ['toDoList'];
  var db = event.target.result;
  try {
    objectStoreNames.map(name => db.deleteObjectStore(name));
  } catch (e) {
    console.log(e);
  }
  var objectStore = db.createObjectStore('toDoList', {
    keyPath: 'taskId',
    autoIncrement: true
  });

  // define what data items the objectStore will contain

  objectStore.createIndex('titleTodo', 'title', { unique: false });
  objectStore.createIndex('typeTodo', 'taskType', { unique: false });
  objectStore.createIndex('stateTodo', 'state', { unique: false });
  objectStore.createIndex('notifiedTodo', 'notified', { unique: false });
  objectStore.createIndex('order', 'order', { unique: false });
}
export {
  deleteTask,
  onupgradeneeded,
  onsuccess,
  getInitialState,
  getAllData,
  onerror,
  insertTask,
  reorderTask
};
