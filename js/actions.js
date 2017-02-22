/*
* action type
*/

export const ADD = 'add';
export const SELECT = 'select';
export const SETINITIAL = 'setInitial';

/*
* action creators
*/

export function addTask(newTask){
  return { type : ADD, ...newTask}
}

export function selectTask(text){
  return { type: SELECT, text}
} 

export function setInitialState(state){
  return {type: SETINITIAL, state}
}