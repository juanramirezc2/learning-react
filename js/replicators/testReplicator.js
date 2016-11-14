const onStateChange = ({ store,nextState,create,setState,setError })=>{
    console.log(store.getState())
    console.log("nextState",nextState)
}
const handleQuery = ({store,query,options,setResult,setError})=>{
    /*
    fetch(`http://paradigm-api.f12.global/api/0.1/documents/`)
        .then((r)=>r.json())
        .then((r)=>{
            console.log("ajax response",r.pkg.documents)
            setResult(r.pkg.documents)
        }).catch((e)=>{
            console.log(e)
        }) */
    setTimeout((e)=>{
        console.log(setResult,"this is the set result after the setTimeout") 
        setResult([
                {result:1},
                {result:2}
        ])},0)
}

export default {
    handleQuery,
    onStateChange
}
