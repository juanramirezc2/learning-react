import { ADD, DELETE, SETINITIAL, REORDER } from "./actions";
import { move } from "./common"
const initialState = {
  tasks: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      return {
        tasks: [
          ...state.tasks,
          {
            title: action.title,
            taskId: action.taskId,
            taskType: action.taskType,
            state: { complete: false }
          }
        ]
      };

    case DELETE:
      return {
        tasks: state.tasks.filter(task => task.taskId != action.taskId)
      };

    case REORDER:
      return {
        //TODO: figure out why this move function isn't swaping elements in the array 
        tasks: move(state.tasks, action.source, action.target)
      };

    case SETINITIAL:
      return action.state;

    default:
      return state;
  }
};
