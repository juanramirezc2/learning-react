import { ADD, DELETE, SETINITIAL, REORDER } from "./actions";
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
      console.log(state.tasks, "state before hover");
      let sourceIndex, targetIndex;
      for (let i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].taskId == action.source) {
          sourceIndex = i;
        } else if (state.tasks[i].taskId == action.target) {
          targetIndex = i;
        }
      }
      console.log(sourceIndex, targetIndex);
      //debugger;
      let temp = state.tasks[sourceIndex];
      state.tasks[sourceIndex] = state.tasks[targetIndex];
      state.tasks[targetIndex] = temp;
      console.log(state.tasks, "state after hover");
      return {
        tasks: state.tasks
      };

    case SETINITIAL:
      return action.state;

    default:
      return state;
  }
};
