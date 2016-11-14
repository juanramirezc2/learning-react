import {PropTypes} from 'react'
import React from 'react'

const Rapid = ({numberWithChars, plusOne,lessOne}) => (
  <div className="RapidLogin">
  <div className="actualResult">
  {numberWithChars}
  </div>
  <a href="#" onClick = {(e)=>{
    plusOne(1)
    return false
  }}>pluss one</a>
  <a href="#" onClick = {(e)=>{
    lessOne(1)
    return false
  }}>less one</a>
  <form className="RapidLoginForm">
    <label htmlFor="rapidLogin" >new task </label>
    <input id="rapidLogin" type='text'/>
    <label htmlFor="typeTask">type</label>
    <select id="typeTask">
      <option value = "task"> task </option>
      <option value ="event"> event </option>
      <option value ="note"> note </option>
    </select>
    </form>
  </div>
)
Rapid.propTypes = {
  ElementId : PropTypes.string,
  numberWithChars : PropTypes.any,
  actualResult : PropTypes.any,
  plusOne : PropTypes.func,
  lessOne :  PropTypes.func
}

export default Rapid
