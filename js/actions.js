import { insertTask, deleteTask, reorderTask } from "./db";

/*
* action type
*/

export const ADD = "add";
export const SELECT = "select";
export const SETINITIAL = "setInitial";
export const DELETE = "delete";
export const REORDER = "reorder";

/*
* action creators
*/

export function addTask(taskData) {
  return dispatch => {
    let newTask = {
      taskId: Math.random(),
      ...taskData
    };
    insertTask(newTask).onsuccess = e => dispatch({ type: ADD, ...newTask });
  };
}

/* change the order of the tasks, move source before target, replicate to indexedDb? */
export function reorderTaskAction(source, target) {
  /* transactions doesn't have onsuccess has oncomplete */
  return dispatch => {
      reorderTask(source, target).oncomplete = e => {
        dispatch({ type: REORDER, source, target });
      }
  };
}

export function deleteTaskAction(taskId) {
  return dispatch => {
    deleteTask(taskId).onsuccess = e => {
      dispatch({ type: DELETE, taskId });
    };
  };
}

export function selectTask(text) {
  return { type: SELECT, text };
}

export function setInitialState(state) {
  return { type: SETINITIAL, state };
}
