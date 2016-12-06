const onStateChange = ({ store,nextState,create,setState,setError })=>{
    console.log(store.getState())
    console.log("nextState",nextState)
}
const handleQuery = ({store,query,options,setResult,setError})=>{
    setTimeout(()=>{
        setResult([
                  {result:1},
                  {result:2}
        ])
    },500)       
}

export default {
    handleQuery,
    onStateChange
}
