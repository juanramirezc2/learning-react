import React from 'react';
import Task from './Task';
import { List, ListItem } from 'material-ui/List';
import app from '../../../css/app.css';

const types = {
  task: 'todo'
};

class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { tasks, deleteTask, reorderTasks } = props;
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
          open={() => {}}
          message="test"
          autoHideDuration={4000}
          onRequestClose={() => {}}
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
