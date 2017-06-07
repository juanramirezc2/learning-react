import { PropTypes } from 'react';
import React from 'react';
import app from '../../../css/app.css';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import Paper from 'material-ui/Paper';

/* drag functions */
const Types = {
  task: 'todo'
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
      taskId: props.task.taskId,
      taskOrder: props.task.order
    };
  },
  endDrag(props, monitor, component) {
    console.log(props, monitor, component);
  }
};

/* drop functions */
const dropSpec = {
  drop: function(props, monitor) {
    console.log('drop');
  },
  hover: function(props, monitor, component) {
    const dragId = monitor.getItem().taskId;
    const hoverId = props.task.taskId;
    const taskOrder = monitor.getItem().taskOrder;
    const hoverOrder = props.task.order;
    const componentDomEl = findDOMNode(component);
    const boundingReactHover = componentDomEl.getBoundingClientRect();
    const mousePosition = monitor.getClientOffset();
    // Don't replace items with themselves
    if (dragId === hoverId) {
      return;
    }
    console.log(taskOrder);
    console.log(hoverOrder);
    props.reorderTasks(
      { id: dragId, order: taskOrder },
      { id: hoverId, order: hoverOrder }
    );
  }
};

const collectDrop = function(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    itemOver: monitor.getItem()
  };
};

const TaskType = {
  event: '🔘',
  task: '➖'
};

const Task = props => {
  /* provided functions */
  const {
    deleteTask,
    connectDragSource,
    connectDropTarget,
    isDragging,
    reorderTasks,
    itemOver
  } = props;

  const DragAndDropZone = connectDragSource(
    connectDropTarget(
      <div className={app.task__dragZone}>
        🔄
      </div>
    )
  );
  /* paper style */
  const style = {
    height: 'auto',
    width: '100%',
    margin: '0 2 7 2',
    padding: '5 10',
    display: 'flex'
  };
  /* task data */
  const { taskId, title, taskType, state } = props.task;

  return (
    <li
      href="#"
      className={classNames(app.task, {
        [app.task_isDraging]: isDragging
      })}
      onClick={deleteTask(taskId)}
    >
      <Paper style={style} zDepth={2}>
        {DragAndDropZone}
        <div className={app.task__type}>
          {TaskType[taskType]}
        </div>
        <div className={app.task__title}>
          {title}
        </div>
      </Paper>
    </li>
  );
};

export default DropTarget(Types.task, dropSpec, collectDrop)(
  DragSource(Types.task, dragSpec, collectDrag)(Task)
);
