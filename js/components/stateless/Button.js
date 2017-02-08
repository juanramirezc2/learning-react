import React, { PropType } from "react";

const Button = ({text,callback})=><button onClick={callback} >{text}</button>

export default Button