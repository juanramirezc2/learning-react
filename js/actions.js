import { insertTask, updateTask } from "./db";

/*
* action type
*/

export const ADD = "add";
export const SELECT = "select";
export const SETINITIAL = "setInitial";

/*
* action creators
*/

export function addTask(newTask) {
  return function(dispatch) {
    let newTask = {
      taskId: Math.random(),
      ...newTask
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
