import { PropTypes } from "react";
import React from "react";
import app from "../../../css/app.css";
import classNames from "classnames";
import { DragSource } from "react-dnd";
import { DropTarget } from "react-dnd";

/* drag functions */
const Types = {
  task: "todo"
};

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const dragSpec = {
  beginDrag(props) {
    return {
      taskId: props.taskId
    };
  },
  endDrag(props, monitor, component) {
    console.log(props, monitor, component);
  }
};

/* drop functions */
const dropSpec = {
  drop: function(props) {
    console.log(`dropped element`);
  }
};

const collectDrop = function(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

const TaskType = {
  event: "🔘",
  task: "➖"
};

const task = props => {
  const {
    taskId,
    title,
    type,
    state,
    deleteTask,
    connectDragSource,
    isDragging,
    connectDropTarget
  } = props;
  return connectDropTarget(
    connectDragSource(
      <a
        href="#"
        className={classNames(app.task, {
          [app.task_complete]: state.complete
        })}
        onClick={deleteTask(taskId)}
      >
        {isDragging}
        <div className={app.task__type}>
          {TaskType[type]}
        </div>
        <div className={app.task__title}>
          {title}
        </div>
      </a>
    )
  );
};

export default DropTarget(Types.task, dropSpec, collectDrop)(
  DragSource(Types.task, dragSpec, collectDrag)(task)
);
