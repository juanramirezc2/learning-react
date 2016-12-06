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
 console.log(`the provider is ready`)
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
  },
  someOtherReducer(state=[],{type,newState}){
    switch(type){
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
  reducerKeys:true
}
export default {
  key,
  onReady,
  merge,
  reducers,
  actions,
  replication
}
