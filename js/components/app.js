import React from "react";
import RapidLogin from "./rapid";
import Task from './stateless/Task';
import List from './stateless/List';
import ProvidedList from './containers/taskProvider'

var App = () => (
  <div>
    <ProvidedList />
  </div>
);

export default App;
