import provideArray from 'provide-array';

const INCREMENT = 'INCREMENT';

const test = provideArray();

test.actions.incrementCount = () => ({ type: INCREMENT });

test.reducers.count = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;

    default:
      return state;
  }
};

export default test;
