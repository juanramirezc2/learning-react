import { connect } from "react-redux";
import Head from "../stateless/Head";
import { addTask } from "../../actions";

const mapDispatchToProps = dispatch => ({
  addCallback: title => {
    let newTask = {
      title,
      taskType: "task",
      state: "uncomplete",
      notified: "false"
    };
    dispatch(addTask(newTask));
  },
  selectCallback: title => console.log("test App callback")
});
const CreateAndSelect = connect(null, mapDispatchToProps)(Head);

export default CreateAndSelect;
