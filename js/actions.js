/*
* action type
*/

export const ADD = 'add';
export const SELECT = 'select';

/*
* action creators
*/

export function addTask(title){
  return { type : ADD, taskType:"task",title ,state: {complete:false}}
}

export function selectTask(text){
  return { type: SELECT, text}
} 