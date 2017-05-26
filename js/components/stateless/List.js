import React from 'react';
import Task from './Task';
import { List, ListItem } from 'material-ui/List';

const types = {
  task: 'todo'
};

var TaskList = props => {
  const { tasks, deleteTask, reorderTasks } = props;
  return (
    <List>
      {tasks.map((task, i) => (
        <ListItem key={i}>
          <Task
            task={task}
            deleteTask={deleteTask}
            reorderTasks={reorderTasks}
          />
        </ListItem>
      ))}
    </List>
  );
};
//Default Props
TaskList.defaultProps = { tasks: [] };

//Props Types
TaskList.propTypes = { tasks: React.PropTypes.array };

export default TaskList;
