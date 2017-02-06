import { connect } from 'react-redux'
import List from '../stateless/List'

const mapStateToProps = (state)=>({
  tasks: state.tasks
})
const mapDispatchToProps = (dispatch)=>({
  taskCallback: ()=>console.log("test App")
})
const Tasks = connect(mapStateToProps,mapDispatchToProps)(List)
export default Tasks