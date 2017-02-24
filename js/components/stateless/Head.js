import React, { PropType } from "react";
import TextField from "./TextField";
import Button from "./Button";
import app from "../../../css/app.css";
import classNames from "classnames";

class Head extends React.Component {
  constructor(props) {
    super(props);
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.addCallback(this.taskName.value);
    this.form.reset();
  }
  render() {
    const { selectCallback } = this.props;
    return (
      <form
        onSubmit={this.onSubmit.bind(this)}
        ref={el => this.form = el}
        className={app.head}
      >
        <TextField
          sth={app.head__textField}
          refCallback={el => {
            this.taskName = el;
          }}
        />
        <input type="submit" value="add" />
        <Button text="select" callback={selectCallback} />
      </form>
    );
  }
}

export default Head;
