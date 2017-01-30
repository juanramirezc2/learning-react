import React from "react";
import RapidLogin from "./rapid";
import Task from './task';
import QueryComponent from "./queryComponent";
var App = () => (
  <div>
    <RapidLogin ElementId="1" />
    <RapidLogin ElementId="2" />
    <QueryComponent />
    <Task title="test"/>
  </div>
);

export default App;
