import { connect } from 'react-redux';
import Head from '../stateless/Head';
import { addTask } from '../../actions';

const mapDispatchToProps = dispatch => ({
  addCallback: (title, order) => {
    let newTask = {
      title,
      taskType: 'task',
      state: 'uncomplete',
      notified: 'false',
      order
    };
    dispatch(addTask(newTask));
  }
});
const mapStateToProps = state => ({
  order: state.tasks.length
});
const CreateAndSelect = connect(mapStateToProps, mapDispatchToProps)(Head);

export default CreateAndSelect;
