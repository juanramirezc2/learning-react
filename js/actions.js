import { insertTask, deleteTask, reorderTask, getAllData } from './db';

/*
* action type
*/

export const ADD = 'add';
export const SELECT = 'select';
export const SETINITIAL = 'setInitial';
export const DELETE = 'delete';
export const REORDER = 'reorder';

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
