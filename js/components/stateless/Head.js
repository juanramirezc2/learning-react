import React, { PropType } from 'react';
import Button from './Button';
import app from '../../../css/app.css';
import classNames from 'classnames';
import TextField from 'material-ui/TextField';

class Head extends React.Component {
  constructor(props) {
    super(props);
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.addCallback(this.taskName, this.props.order);
    this.form.reset();
  }
  handleChange(event, newValue) {
    this.taskName = newValue;
  }
  render() {
    return (
      <form
        onSubmit={this.onSubmit.bind(this)}
        ref={el => (this.form = el)}
        className={app.head}
      >
        <TextField
          className={app.head__textField}
          name="taskInput"
          hintText="next task to tackle 💪🏼"
          fullWidth={true}
          onChange={this.handleChange.bind(this)}
        />
      </form>
    );
  }
}

export default Head;
