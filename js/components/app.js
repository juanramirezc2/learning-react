import React from "react";
import RapidLogin from "./rapid";
import Task from './task';
import QueryComponent from "./queryComponent";
var App = () => (
  <div>
    <RapidLogin ElementId="1" />
    <RapidLogin ElementId="2" />
    <QueryComponent />
    <Task title="test" type="task" state={{complete: true}}/>
    <Task title="test2 no complete" type="task" state={{complete: false}}/>
  </div>
);

export default App;
