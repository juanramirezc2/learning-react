import { PropTypes } from "react";
import React from "react";
import app from "../../../css/app.css";
import classNames from "classnames";
const TaskType = {
  event :"🔘",
  task  :"➖"
}
const task = ({ title, type, state }) => (
  <a href="#" className={classNames(app.task,{[app.task_complete]:state.complete})}>
    <div className={app.task__type}>
      {TaskType[type]}
    </div>
    <div className={app.task__title}>
      {title}
    </div>
  </a>
);

export default task;
