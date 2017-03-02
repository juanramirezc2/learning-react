import { connect } from "react-redux";
import List from "../stateless/List";
import { deleteTaskAction, reorderTaskAction } from "../../actions";

const mapStateToProps = state => {
  return { tasks: state.tasks };
};
const mapDispatchToProps = dispatch => ({
  deleteTask: taskId => () => {
    dispatch(deleteTaskAction(taskId));
  },
  reorderTasks: (source, target, replicate) => {
    dispatch(reorderTaskAction(source, target, replicate));
  }
});
const Tasks = connect(mapStateToProps, mapDispatchToProps)(List);
export default Tasks;
