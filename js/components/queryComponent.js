import React  from 'react'
const QueryComponent = React.createClass({
  getDefaultProps(){
    return { query:{actualResult:5} }
  },
  render(){
    const {result} = this.props
    console.log("update not sure",result)
    if(result == null){
      return (<div>loading</div>)
    }
    else{
      return (<div>this is the result
                  {result.map((o)=>(<div>{o.result}</div>))}
                  </div>)
    }
   
  }
})
QueryComponent.propTypes = {
  result :React.PropTypes.any
}

export default QueryComponent
