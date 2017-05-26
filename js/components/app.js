import React from 'react';
import Task from './stateless/Task';
import List from './stateless/List';
import ProvidedList from './containers/taskProvider';
import ProvidedHead from './containers/addAndSelectTask';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTMLBackend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import RaisedButton from 'material-ui/RaisedButton';

var App = () => (
  <div>
    <RaisedButton label="Default" />
    <ProvidedHead />
    <ProvidedList />
  </div>
);
var appWrapped;
if (window.innerWidth > 768) {
  appWrapped = DragDropContext(HTMLBackend)(App);
} else {
  appWrapped = DragDropContext(TouchBackend({ enableMouseEvents: true }))(App);
}
export default appWrapped;
