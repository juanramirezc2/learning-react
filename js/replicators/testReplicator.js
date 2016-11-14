const onStateChange = ({ store,nextState,create,setState,setError })=>{
    console.log(store.getState())
    console.log("nextState",nextState)
}
export default {
    onStateChange
}
