import React from "react";
import Task from "./stateless/Task";
import List from "./stateless/List";
import ProvidedList from "./containers/taskProvider";
import ProvidedHead from "./containers/addAndSelectTask";
import { default as TouchBackend } from "react-dnd-touch-backend";
import { DragDropContext } from "react-dnd";

var App = () => (
  <div>
    <ProvidedHead />
    <ProvidedList />
  </div>
);

export default DragDropContext(TouchBackend)(App);
