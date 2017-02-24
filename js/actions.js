import { insertTask, deleteTask } from "./db";

/*
* action type
*/

export const ADD = "add";
export const SELECT = "select";
export const SETINITIAL = "setInitial";

/*
* action creators
*/

export function addTask(taskData) {
  return function(dispatch) {
    let newTask = {
      taskId: Math.random(),
      ...taskData
    };
    insertTask(newTask).onsuccess = e => {
      dispatch({ type: ADD, ...newTask });
    };
  };
}

export function selectTask(text) {
  return { type: SELECT, text };
}

export function setInitialState(state) {
  return { type: SETINITIAL, state };
}
