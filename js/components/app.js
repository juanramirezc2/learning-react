import React from "react";
import Task from './stateless/Task';
import List from './stateless/List';
import ProvidedList from './containers/taskProvider'
import ProvidedHead from './containers/addAndSelectTask'

var App = () => (
  <div>
    <ProvidedHead />
    <ProvidedList />
  </div>
);

export default App;
