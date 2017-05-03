import { ADD, DELETE, SETINITIAL, REORDER } from './actions';
import { move } from './common';
const initialState = {
  tasks: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case REORDER:
      //swap order
      let reorderedTasks = state.tasks.map(task => {
        if (action.sourceInfo.id == task.taskId) {
          task.order = action.targetInfo.order;
          return task;
        } else if (action.targetInfo.id == task.taskId) {
          task.order = action.sourceInfo.order;
          return task;
        } else {
          return task;
        }
      });
      return {
        tasks: reorderedTasks
      };

    case SETINITIAL:
      console.log('initial state from the DB', action.state);
      return action.state;

    default:
      return state;
  }
};
