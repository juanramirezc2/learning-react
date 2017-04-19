import { PropTypes } from "react";
import React from "react";
import app from "../../../css/app.css";
import classNames from "classnames";
import { DragSource } from "react-dnd";
import { DropTarget } from "react-dnd";
import { findDOMNode } from 'react-dom';

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
  drop: function(props, monitor) {
    console.log("drop")
  },
  hover: function(props, monitor, component) {
    const dragId = monitor.getItem().taskId;
    const hoverId = props.task.taskId;
    const componentDomEl = findDOMNode(component); 
    const boundingReactHover = componentDomEl.getBoundingClientRect();
    const mousePosition = monitor.getClientOffset()
    const middleComponent = boundingReactHover.top + ((boundingReactHover.bottom-boundingReactHover.top)/2);
     // Don't replace items with themselves
    if (dragId === hoverId) {
      return;
    }
    // mobile browsers are very accurate and return float 
    if(middleComponent!==Math.trunc(mousePosition.y)){
      return
    }
    props.reorderTasks(dragId,hoverId)
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
