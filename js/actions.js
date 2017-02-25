import { insertTask, deleteTask } from "./db";

/*
* action type
*/

export const ADD = "add";
export const SELECT = "select";
export const SETINITIAL = "setInitial";
export const DELETE = "delete";

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
