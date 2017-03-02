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
      taskId: props.task.taskId
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
  },
  hover: function(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    console.log("sth");

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
  }
};

const collectDrop = function(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    itemOver: monitor.getItem()
  };
};

const TaskType = {
  event: "🔘",
  task: "➖"
};

const task = props => {
  /* provided functions */
  const {
    deleteTask,
    connectDragSource,
    isDragging,
    reorderTasks,
    connectDropTarget,
    itemOver
  } = props;

  /* task data */
  const {
    taskId,
    title,
    type,
    state
  } = props.task;

  return connectDragSource(
    connectDropTarget(
      <a
        href="#"
        className={classNames(app.task, {
          [app.task_isDraging]: isDragging
        })}
        onClick={deleteTask(taskId)}
      >
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
