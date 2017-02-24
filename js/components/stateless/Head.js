import React, { PropType } from "react";
import TextField from "./TextField";
import Button from "./Button";
import app from "../../../css/app.css"

class Head extends React.Component {
  constructor(props) {
    super(props);
  }
  onSubmit(e) {
    e.preventDefault()
    this.props.addCallback(this.taskName.value)
  }
  render() {
    const { selectCallback } = this.props;
    return (
      <form onSubmit={this.onSubmit.bind(this)}  className={app.head}>
        <TextField refCallback={(el)=>{this.taskName = el}}  />
        <input type="submit" value="add"/>
        <Button text="select" callback={selectCallback} />
      </form>
    );
  }
}

export default Head;
