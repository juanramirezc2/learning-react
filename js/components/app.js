import React from "react";
import RapidLogin from "./rapid";
import Task from './stateless/Task';
import List from './stateless/List';

var App = () => (
  <div>
    <List tasks= {[
      {title:"test",type:"task",state:{complete:false}},
      {title:"test2",type:"event",state:{complete:true}}
    ]}/>
  </div>
);

export default App;
