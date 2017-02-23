import { connect } from 'react-redux'
import Head from '../stateless/Head'
import { addTask } from '../../actions'
import {insertTask} from '../../db'

const mapDispatchToProps = (dispatch)=>({
  addCallback: (title)=> {
    let newTask = { taskId: Math.random() , title, taskType: "task", state: "uncomplete", notified: "false"}
    insertTask(newTask).onsuccess = (e)=>{
      dispatch(addTask(newTask))
    }
  },
  selectCallback: (title)=>console.log("test App callback")
})
const CreateAndSelect = connect(null,mapDispatchToProps)(Head)

export default CreateAndSelect