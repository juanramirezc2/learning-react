import React, { PropType } from "react";
import TextField from "./TextField";
import Button from "./Button";
import app from "../../../css/app.css"

class Head extends React.Component {
  constructor(props) {
    super(props);
  }
  handleChange(event) {
    this.taskName = event.target.value;
  }
  render() {
    const { addCallback, selectCallback } = this.props;
    return (
      <form action="javascript:void(0);" className={app.head}>
        <TextField refCallback={(el)=>{this.taskName = el}}  />
        <Button text="add" callback={(e)=>{addCallback(this.taskName.value)}} />
        <Button text="select" callback={selectCallback} />
      </form>
    );
  }
}

export default Head;
