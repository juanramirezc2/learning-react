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
        if (state.tasks[i].taskId == action.source ) {
          sourceIndex = i;
        } else if (state.tasks[i].taskId == action.target) {
          targetIndex = i;
        }
      }
      console.log(sourceIndex, targetIndex);  
      console.log(state.tasks[sourceIndex],state.tasks[targetIndex],"values of source Index and target Index")
      //clone task state
      var reorderedTask = state.tasks.splice(0)
      let temp = reorderedTask[sourceIndex];
      reorderedTask[sourceIndex] = reorderedTask[targetIndex];
      reorderedTask[targetIndex] = temp;
      console.log(reorderedTask, "state after hover");
      return {
        tasks: reorderedTask
      };

    case SETINITIAL:
      return action.state;

    default:
      return state;
  }
};
