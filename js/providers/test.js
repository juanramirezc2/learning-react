const PLUS = 'PLUS'
const LESS = 'LESS'
const key = ({props:{ElementId}}) =>`abcd${ElementId}`
const merge = {
  numberWithChars:{
    keys : ['actualResult'],
    get(state,props){
      return `this is the result ${state.actualResult}` 
    }
  }
}
const onReady = () =>{

}
const reducers ={
  actualResult(state = 0, {type,number}){
    switch(type){
      case PLUS:
        return  state + number
      case LESS:
        return state - number
      default:
        return state 
    }
  }
}
const actions = {
  plusOne: (number) => ({type:PLUS,number}),
  lessOne: (number) =>({type:LESS,number}) 
}
const replication = { 
  reducerKeys:false
}
export default {
  key,
  onReady,
  merge,
  reducers,
  actions,
  replication
}
