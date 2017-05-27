import React, { PropType } from 'react';
import TextField from 'material-ui/TextField';

const TextFieldTask = ({ refCallback, sth }) => (
  <TextField
    className={sth}
    hintText="Full width"
    fullWidth={true}
    ref={refCallback}
  />
);

export default TextFieldTask;
