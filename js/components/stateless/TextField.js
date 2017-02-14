import React, { PropType } from "react";

const TextField= ({onchange,refCallback})=><input ref={refCallback} type="text" onChange={onchange}/>

export default TextField