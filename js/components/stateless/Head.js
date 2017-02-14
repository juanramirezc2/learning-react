import React, { PropType } from "react";
import TextField from "./TextField";
import Button from "./Button";

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
      <div>
        <TextField refCallback={(el)=>{this.taskName = el}}  />
        <Button text="add" callback={(e)=>{addCallback(this.taskName.value)}} />
        <Button text="select" callback={selectCallback} />
      </div>
    );
  }
}

export default Head;
