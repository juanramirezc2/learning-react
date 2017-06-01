import React from 'react';
import Task from './Task';
import { List, ListItem } from 'material-ui/List';
import app from '../../../css/app.css';
import Snackbar from 'material-ui/Snackbar';

const types = {
  task: 'todo'
};

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleCloseSnackbar() {
    this.setState({
      open: false
    });
  }
  handleOpenSnackbar() {
    this.setState({
      open: true
    });
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
        <div onClick={this.handleOpenSnackbar.bind(this)}>
          test handle snackbar
        </div>
        <Snackbar
          open={this.state.open}
          message="task deleted"
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
