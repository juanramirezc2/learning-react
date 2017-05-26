import { connect } from 'react-redux';
import Head from '../stateless/Head';
import { addTask } from '../../actions';

const mapDispatchToProps = dispatch => ({
  addCallback: (title, order) => {
    console.log('hola mindo');
  }
});
const mapStateToProps = state => ({
  order: state.tasks.length
});
const CreateAndSelect = connect(mapStateToProps, mapDispatchToProps)(Head);

export default CreateAndSelect;
