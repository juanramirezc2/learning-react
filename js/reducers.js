import { ADD, DELETE, SETINITIAL } from "./actions";
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

    case SETINITIAL:
      return action.state;

    default:
      return state;
  }
};
