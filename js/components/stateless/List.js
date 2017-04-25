import React from "react";
import Task from "./Task";

const types = {
  task: "todo"
};

var List = props => {
  const { tasks, deleteTask, reorderTasks} = props;
  return (
    <div>
      {tasks.map((task, i) => (
        <Task
          key={i}
          task={task}
          deleteTask={deleteTask}
          reorderTasks={reorderTasks}
        />
      ))}
    </div>
  );
};
//Default Props
List.defaultProps = { tasks: [] };

//Props Types
List.propTypes = { tasks: React.PropTypes.array };

export default List;
