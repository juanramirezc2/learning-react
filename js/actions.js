import { insertTask, deleteTask, reorderTask, getAllData } from './db';

/*
* action type
*/

export const ADD = 'add';
export const SELECT = 'select';
export const SETINITIAL = 'setInitial';
export const DELETE = 'delete';
export const REORDER = 'reorder';



/*notifications creator ;) thinking towards push notifications*/
  // function for creating the notification
  function createNotification(title) {
     // Let's check if the browser supports notifications
    if (!"showNotification" in ServiceWorkerRegistration.prototype) {
      console.log("This browser does not support notifications.");
    }
     // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      
      var img = '/images/icons/icon-128x128.png';
      var text = 'HEY! Your task "' + title + '" is now overdue.';

      navigator.serviceWorker.ready.then((serviceWorkerRegistration)=>{
        var notification = serviceWorkerRegistration.showNotification('To do list', { body: text, icon: img });
       })
      
      
      window.navigator.vibrate(500);
    }
   
   

   

    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {

        // Whatever the user answers, we make sure Chrome stores the information
        if(!('permission' in Notification)) {
          Notification.permission = permission;
        }

        // If the user is okay, let's create a notification
        if (permission === "granted") {
          var img = '/images/icons/icon-128x128.png';
          var text = 'HEY! Your task "' + title + '" is now overdue.';
          navigator.serviceWorker.ready.then((serviceWorkerRegistration)=>{
             var notification = serviceWorkerRegistration.showNotification('To do list', { body: text, icon: img });
          })
          window.navigator.vibrate(500);
        }
      });
    }
  }

/*
* action creators
*/
async function refreshRedux(dispatch) {
  // refresh redux state with the new data stored in indexedDb
  let allData = await getAllData();
  let state = { tasks: allData };
  dispatch({ type: SETINITIAL, state });
}
/* add a new task */
export function addTask(taskData) {
  return dispatch => {
    let newTask = {
      taskId: Math.random(),
      ...taskData
    };
    insertTask(newTask).oncomplete = e => {
      refreshRedux(dispatch)
    };
  };
}

/* change the order of the tasks, move source before target, replicate to indexedDb? */
export function reorderTaskAction(sourceInfo, targetInfo) {
  return dispatch => {
    reorderTask(sourceInfo, targetInfo).oncomplete = e => {
      refreshRedux(dispatch)
    };
  };
}
/* delete a task */
export function deleteTaskAction(taskId) {
  return dispatch => {
    deleteTask(taskId).onsuccess = e => {
       refreshRedux(dispatch)
       createNotification("test Notifications")
    };
  };
}

export function selectTask(text) {
  return { type: SELECT, text };
}

export function setInitialState(tasks) {
  let state = { tasks };
  return { type: SETINITIAL, state };
}
