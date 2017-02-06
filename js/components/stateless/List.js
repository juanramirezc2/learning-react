import React from "react";
import Task from "./Task";
var List = ({ tasks, completeTask }) => (
  <div>
    {tasks.map(task => (
      <Task
        title={task.title}
        type={task.type}
        state={task.state}
      />
    ))}
  </div>
);
//Default Props
List.defaultProps = { tasks: [] };

//Props Types
List.propTypes = { tasks: React.PropTypes.array
  };

export default List;
