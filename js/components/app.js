import React from "react";
import Task from "./stateless/Task";
import List from "./stateless/List";
import ProvidedList from "./containers/taskProvider";
import ProvidedHead from "./containers/addAndSelectTask";
import { default as TouchBackend } from "react-dnd-touch-backend";
import HTMLBackend from "react-dnd-html5-backend"
import { DragDropContext } from "react-dnd";

var App = () => (
  <div>
    <ProvidedHead />
    <ProvidedList />
  </div>
);
const appWrapped 
if(window.innerWidth>768){
  appWrapped = DragDropContext()
}
else {
  appWrapped = DragDropContext(TouchBackend({ enableMouseEvents: true }))(App);
}
export default  appWrapped
