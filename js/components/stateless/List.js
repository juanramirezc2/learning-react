import React from "react";
import Task from "./Task";
var List = ({ tasks, deleteTask }) => (
  <div>
    {tasks.map((task, i) => (
      <Task
        key={i}
        taskId={task.taskId}
        title={task.title}
        deleteTask={deleteTask}
        type={task.taskType}
        state={task.state}
      />
    ))}
  </div>
);
//Default Props
List.defaultProps = { tasks: [] };

//Props Types
List.propTypes = { tasks: React.PropTypes.array };

export default List;
