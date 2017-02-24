import { ADD, SETINITIAL } from "./actions";
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
            taskType: action.taskType,
            state: { complete: false }
          }
        ]
      };

    case SETINITIAL:
      return action.state;

    default:
      return state;
  }
};
