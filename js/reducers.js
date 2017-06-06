import { ADD, DELETE, SETINITIAL, REORDER } from './actions';
import { move } from './common';

const initialState = {
  tasks: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SETINITIAL:
      return action.state;

    default:
      return state;
  }
};
