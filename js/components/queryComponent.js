import React  from 'react'

const QueryComponent = ({result})=>{
  if(result === null){
    return (<div>loading...</div>)
  }
  else if(result){
    return (<div>this is the result
            {result.map((o)=>(<div>{o.result}</div>))}
            </div>)
  }
  else{
    return (<div>error</div>)
  }
}

QueryComponent.defaultProps = {
  query:{actualResult:5}
}

QueryComponent.propTypes = {
  query: React.PropTypes.any,
  result :React.PropTypes.any
}

export default QueryComponent
