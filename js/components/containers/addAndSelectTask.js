import { connect } from 'react-redux'
import Head from '../stateless/Head'
import { addTask } from '../../actions'

const mapDispatchToProps = (dispatch)=>({
  addCallback: (title)=> {
    dispatch(addTask(title))
  },
  selectCallback: (title)=>console.log("test App callback")
})
const mapStateToProps = () =>({})
const CreateAndSelect = connect(mapStateToProps,mapDispatchToProps)(Head)

export default CreateAndSelect