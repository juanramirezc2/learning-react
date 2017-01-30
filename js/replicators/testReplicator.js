const onStateChange = ({ store, nextState, create, setState, setError }) => {
  console.log(store.getState());
  console.log("nextState", nextState);
};
const handleQuery = (props) => {
  console.log(`props inside handle query`,props)
  const { store, query, options, setResult, setError } = props
  console.log(query,`query inside handleQuery`)
  setTimeout(
    () => {
      setResult([ { result: 1 }, { result: 2 } ]);
    },
    500
  );
};

export default { handleQuery, onStateChange };
