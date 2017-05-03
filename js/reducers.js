import { ADD, DELETE, SETINITIAL, REORDER } from './actions';
import { move } from './common';
const initialState = {
  tasks: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SETINITIAL:
      console.log('initial state from the DB', action.state);
      return action.state;

    default:
      return state;
  }
};
