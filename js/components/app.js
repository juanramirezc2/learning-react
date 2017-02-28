import React from "react";
import Task from "./stateless/Task";
import List from "./stateless/List";
import ProvidedList from "./containers/taskProvider";
import ProvidedHead from "./containers/addAndSelectTask";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";

var App = () => (
  <div>
    <ProvidedHead />
    <ProvidedList />
  </div>
);

export default DragDropContext(HTML5Backend)(App);
