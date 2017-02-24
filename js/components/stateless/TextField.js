import React, { PropType } from "react";

const TextField = ({ refCallback, sth }) => (
  <input className={sth} ref={refCallback} type="text" />
);

export default TextField;
