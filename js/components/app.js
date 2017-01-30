import RapidLogin from "./rapid";
import QueryComponent from "./queryComponent";
import React from "react";
var App = () => (
  <div>
    <RapidLogin ElementId="1" />
    <RapidLogin ElementId="2" />
    <QueryComponent />
  </div>
);

export default App;
