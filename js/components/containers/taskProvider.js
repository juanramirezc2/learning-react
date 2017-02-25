import { connect } from "react-redux";
import List from "../stateless/List";
import { deleteTaskAction } from "../../actions";

const mapStateToProps = state => {
  return { tasks: state.tasks };
};
const mapDispatchToProps = dispatch => ({
  deleteTask: taskId => () => {
    dispatch(deleteTaskAction(taskId));
  }
});
const Tasks = connect(mapStateToProps, mapDispatchToProps)(List);
export default Tasks;
