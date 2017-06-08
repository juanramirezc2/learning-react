import React from "react";
import Task from "./Task";
import { List, ListItem } from "material-ui/List";
import app from "../../../css/app.css";
import Snackbar from "material-ui/Snackbar";

const types = {
  task: "todo"
};

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      snackbarMsn: ""
    };
  }
  componentW;
  handleCloseSnackbar() {
    this.setState({
      open: false
    });
  }
  handleOpenSnackbar(msn) {
    this.setState({
      open: true,
      snackbarMsn: msn
    });
  }
  componentWillUpdate({ tasks }) {
    const { tasks: actualTasks } = this.props;
    if (actualTasks.length > tasks.length) {
      this.handleOpenSnackbar("task deleted");
    } else {
      this.handleOpenSnackbar("something went wrong 😟");
    }
  }
  render() {
    const { tasks, deleteTask, reorderTasks } = this.props;
    return (
      <div>
        <ul className={app.list}>
          {tasks.map((task, i) => (
            <Task
              key={i}
              task={task}
              deleteTask={deleteTask}
              reorderTasks={reorderTasks}
            />
          ))}
        </ul>
        <Snackbar
          open={this.state.open}
          message={this.state.snackbarMsn}
          autoHideDuration={4000}
          onRequestClose={this.handleCloseSnackbar.bind(this)}
        />
      </div>
    );
  }
}
//Default Props
TaskList.defaultProps = { tasks: [] };

//Props Types
TaskList.propTypes = { tasks: React.PropTypes.array };

export default TaskList;
