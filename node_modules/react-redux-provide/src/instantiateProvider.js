import shallowEqual from './shallowEqual';
import getRelevantKeys from './getRelevantKeys';
import createProviderStore from './createProviderStore';
import { pushOnReady, unshiftOnReady, unshiftMiddleware } from './keyConcats';

const isServerSide = typeof window === 'undefined';
const isTesting = typeof process !== 'undefined'
  && process.env
  && process.env.NODE_ENV === 'test';

const globalProviderInstances = {};

// TODO: we'll use this at some point to select only component propTypes
/*
function hasReducerKeys(providerInstance, getReducerKeys) {
  if (!getReducerKeys) {
    return true;
  }

  const { hasReducerKeys = {} } = providerInstance;

  for (let reducerKey in getReducerKeys) {
    if (!hasReducerKeys[reducerKey]) {
      providerInstance.hasReducerKeys = {
        ...hasReducerKeys,
        ...getReducerKeys
      };

      return false;
    }
  }

  return true;
}*/

/**
 * Instantiates a provider with its own store.
 *
 * @param {Object} fauxInstance resembles { props, context }
 * @param {Object} provider
 * @param {String|Function} providerKey Optional
 * @param {Function} readyCallback Optional
 * @param {Object} createState Optional
 * @param {Object} getReducerKeys Optional
 * @return {Object}
 * @api public
 */
export default function instantiateProvider(
  fauxInstance,
  provider,
  providerKey,
  readyCallback,
  createState,
  getReducerKeys
) {
  if (arguments.length === 1) {
    fauxInstance = arguments[0].fauxInstance;
    provider = arguments[0].provider;
    providerKey = arguments[0].providerKey;
    readyCallback = arguments[0].readyCallback;
    createState = arguments[0].createState;
    getReducerKeys = arguments[0].getReducerKeys;

    if (!fauxInstance) {
      provider = arguments[0];
      fauxInstance = {};
    }
  }

  if (!fauxInstance.props) {
    fauxInstance.props = {};
  }

  if (typeof providerKey === 'undefined') {
    providerKey = provider.key;
  }

  if (!provider.actions) {
    provider.actions = {};
  }
  if (!provider.reducers) {
    provider.reducers = {};
  }

  if (getReducerKeys === true) {
    getReducerKeys = provider.reducers;
  }

  const providers = getProviders(fauxInstance);
  const providerInstances = getProviderInstances(fauxInstance);
  let providerInstance;
  let isStatic = typeof providerKey !== 'function';
  let storeKey;
  let creator;

  if (typeof provider.key === 'string') {
    if (!providers[provider.key]) {
      providers[provider.key] = provider;
    }
  } else if (provider.defaultKey) {
    if (!providers[provider.defaultKey]) {
      providers[provider.defaultKey] = provider;
    }
  } else if (!provider.key || !provider.key.toString) {
    console.warn('Missing or invalid provider key!');
  } else if (!providers[provider.key.toString()]) {
    providers[provider.key.toString()] = provider;
  }

  if (!isStatic) {
    // get actual `providerKey`
    providerKey = providerKey(fauxInstance);
    // if actual `providerKey` matches `key`, treat as static provider
    isStatic = providerKey === provider.key;
  }

  if (providerKey === null) {
    storeKey = null;
    providerKey = provider.defaultKey;
    isStatic = true;
  }

  providerInstance = provider.isGlobal
    ? globalProviderInstances[providerKey]
    : providerInstances && providerInstances[providerKey];

  if (fauxInstance.relevantProviders) {
    fauxInstance.relevantProviders[providerKey] = true;
  }

  // TODO: we'll use this at some point
  //if (providerInstance && hasReducerKeys(providerInstance, getReducerKeys)) {
  if (providerInstance) {
    if (createState) {
      creator = providerInstance;
    } else {
      if (readyCallback) {
        if (providerInstance.ready) {
          readyCallback(providerInstance);
        } else {
          pushOnReady({ providerInstance }, readyCallback);
        }
      }

      providerInstances[providerKey] = providerInstance;
      return providerInstance;
    }
  }

  if (!provider.hasThunk) {
    provider.hasThunk = true;

    if (provider.wait && !Array.isArray(provider.wait)) {
      provider.wait = [ provider.wait ];
    }

    if (provider.clear && !Array.isArray(provider.clear)) {
      provider.clear = [ provider.clear ];
    }

    function findProvider(props) {
      if (getRelevantKeys(provider.reducers, props).length) {
        return provider;
      }

      for (let key in providers) {
        if (getRelevantKeys(providers[key].reducers, props).length) {
          return providers[key];
        }
      }

      return provider;
    }

    function getResultInstances(result, callback) {
      const resultInstances = [];
      let semaphore = result && result.length;
      function clear() {
        if (--semaphore === 0) {
          callback(resultInstances);
        }
      }

      if (!semaphore) {
        semaphore = 1;
        clear();
        return;
      }

      result.forEach((resultProps, index) => {
        resultInstances[index] = null;

        instantiateProvider(
          getTempFauxInstance(fauxInstance, resultProps),
          findProvider(resultProps),
          undefined,
          resultInstance => {
            resultInstances[index] = resultInstance;
            clear();
          }
        );
      });
    }

    function getInstance(props, callback, create) {
      let provider;
      let providerKey;

      if (typeof props === 'string') {  // key is already known
        if (providerInstances[props]) {
          providerKey = props;
        }

        provider = providers[props] || providerInstances[props];
        props = {};
      } else {
        provider = findProvider(props);
      }

      return instantiateProvider(
        getTempFauxInstance(fauxInstance, props),
        provider,
        providerKey,
        callback,
        create ? props : null
      );
    }

    function getInstances(propsArray, callback, create) {
      const instances = [];
      let getCount = propsArray.length;
      const clear = () => {
        if (--getCount === 0) {
          if (callback) {
            callback(instances);
          }
        }
      };

      propsArray.forEach((props, index) => {
        getInstance(props, instance => {
          instances[index] = instance;
          clear();
        }, create);
      });

      return instances;
    }

    function createInstance(props, callback) {
      return getInstance(props, callback, true);
    }

    function createInstances(propsArray, callback) {
      return getInstances(propsArray, callback, true);
    }

    function setStates(states) {
      const gettingInstances = [];
      const settingStates = [];
      let clientStates = null;

      if (!isServerSide) {
        if (!window.clientStates) {
          window.clientStates = {};
        }

        clientStates = window.clientStates;
      }

      for (let providerKey in states) {
        const state = states[providerKey];
        const providerInstance = providerInstances[providerKey];

        if (providerInstance) {
          if (providerInstance.store.setState) {
            settingStates.push(() => providerInstance.store.setState(state));
          }
        } else {
          if (clientStates) {
            clientStates[providerKey] = state;
          }

          gettingInstances.push(state);
        }
      }

      // now that `clientStates` are cached...
      while (gettingInstances.length) {
        getInstance(gettingInstances.shift());
      }
      while (settingStates.length) {
        settingStates.shift()();
      }
    }

    function find(props, doInstantiate, callback) {
      if (arguments.length === 2) {
        callback = doInstantiate;
        doInstantiate = false;
      }

      handleQueries(getTempFauxInstance(fauxInstance, props), () => {
        if (!doInstantiate) {
          callback(props.query ? props.result : props.results);
          return;
        }

        if (props.query) {
          getResultInstances(props.result, callback);
          return;
        }

        const { results } = props;
        const resultsInstances = {};
        const resultsKeys = results && Object.keys(results);
        let semaphore = resultsKeys && resultsKeys.length;
        function clear() {
          if (--semaphore === 0) {
            callback(resultsInstances);
          }
        }

        if (!semaphore) {
          semaphore = 1;
          clear();
        }

        resultsKeys.forEach(resultKey => {
          resultsInstances[resultKey] = [];

          getResultInstances(
            results[resultKey],
            resultInstances => {
              resultsInstances[resultKey] = resultInstances;
              clear();
            }
          );
        });
      });
    }

    const providerApi = {
      getInstance,
      getInstances,
      createInstance,
      createInstances,
      setStates,
      find
    };

    unshiftMiddleware({ provider }, ({ dispatch, getState }) => {
      return next => action => {
        if (typeof action !== 'function') {
          return next(action);
        }

        if (provider.wait) {
          provider.wait.forEach(fn => fn());
        }

        return action(action => {
          const state = store.getState();
          let storeChanged = false;

          dispatch(action);

          if (provider.clear) {
            storeChanged = state !== store.getState();
            provider.clear.forEach(fn => fn(storeChanged));
          }
        }, getState, providerApi);
      };
    });
  }

  if (provider.wait) {
    provider.wait.forEach(fn => fn());
  }

  providerInstance = Object.create(provider);
  providerInstance.providerKey = providerKey;
  providerInstance.isStatic = isStatic;

  const store = createProviderStore(
    providerInstance,
    storeKey,
    createState,
    createState ? (state) => {
      const { onReady } = providerInstance;

      providerInstance = instantiateProvider(
        getTempFauxInstance(fauxInstance, state),
        provider,
        undefined,
        createdInstance => {
          if (Array.isArray(onReady)) {
            onReady.forEach(fn => fn(createdInstance));
          } else if (onReady) {
            onReady(createdInstance);
          }
        }
      );
    } : null,
    // TODO: we need a better way to create + replicate
    creator && creator.store
  );

  const initialState = store.getState();
  const { actions } = providerInstance;
  const actionCreators = {};
  const setKey = store.setKey;

  if (setKey) {
    store.setKey = (newKey, readyCallback) => {
      if (provider.wait) {
        provider.wait.forEach(fn => fn());
      }

      setKey(newKey, () => {
        if (Array.isArray(providerInstance.onReady)) {
          providerInstance.onReady.forEach(fn => fn(providerInstance));
        } else if (providerInstance.onReady) {
          providerInstance.onReady(providerInstance);
        }

        if (readyCallback) {
          readyCallback();
        }

        if (provider.clear) {
          provider.clear.forEach(fn => fn(true));
        }
      });
    };
  }

  for (let actionKey in actions) {
    actionCreators[actionKey] = function() {
      return store.dispatch(actions[actionKey].apply(this, arguments));
    };
  }

  providerInstance.store = store;
  providerInstance.actionCreators = actionCreators;

  if (!createState) {
    if (provider.isGlobal) {
      globalProviderInstances[providerKey] = providerInstance;
    }
    if (providerInstances) {
      providerInstances[providerKey] = providerInstance;
    }
    if (!provider.instances) {
      provider.instances = [];
    }
    provider.instances.push(providerInstance);
  }

  if (provider.subscribers) {
    Object.keys(provider.subscribers).forEach(key => {
      const handler = provider.subscribers[key];
      const subProvider = providers[key];
      function callHandler() {
        const subProviderInstances = subProvider && subProvider.instances;

        if (subProviderInstances) {
          subProviderInstances.forEach(subProviderInstance => {
            handler(providerInstance, subProviderInstance);
          });
        }
      }

      if (subProvider) {
        if (!subProvider.subscribeTo) {
          subProvider.subscribeTo = {};
        }
        if (!subProvider.subscribeTo[provider.key]) {
          subProvider.subscribeTo[provider.key] = handler;
        }
      }

      providerInstance.store.subscribe(callHandler);
      callHandler();
    });
  }

  if (provider.subscribeTo) {
    Object.keys(provider.subscribeTo).forEach(key => {
      const handler = provider.subscribeTo[key];
      const supProvider = providers[key];

      if (!supProvider) {
        return;
      }

      if (!supProvider.subscribers) {
        supProvider.subscribers = {};
      }
      if (!supProvider.subscribers[provider.key]) {
        supProvider.subscribers[provider.key] = handler;

        if (supProvider.instances) {
          supProvider.instances.forEach(supProviderInstance => {
            supProviderInstance.store.subscribe(() => {
              provider.instances.forEach(providerInstance => {
                handler(supProviderInstance, providerInstance);
              });
            });
          });
        }
      }

      if (supProvider.instances) {
        supProvider.instances.forEach(supProviderInstance => {
          handler(supProviderInstance, providerInstance);
        });
      }
    });
  }

  if (!createState) {
    if (Array.isArray(providerInstance.onInstantiated)) {
      providerInstance.onInstantiated.forEach(fn => fn(providerInstance));
    } else if (providerInstance.onInstantiated) {
      providerInstance.onInstantiated(providerInstance);
    }
  }

  unshiftOnReady({ providerInstance }, () => {
    providerInstance.ready = true;
  });

  if (readyCallback) {
    pushOnReady({ providerInstance }, readyCallback);
  }

  function done() {
    if (Array.isArray(providerInstance.onReady)) {
      providerInstance.onReady.forEach(fn => fn(providerInstance));
    } else if (providerInstance.onReady) {
      providerInstance.onReady(providerInstance);
    }

    if (provider.clear) {
      const storeChanged = initialState !== providerInstance.store.getState();
      provider.clear.forEach(fn => fn(storeChanged));
    }
  }

  if (provider.replication && store.onReady && !store.initializedReplication) {
    store.onReady(done);
  } else {
    done();
  }

  return providerInstance;
}

function getContext(fauxInstance) {
  if (!fauxInstance.context) {
    fauxInstance.context = {};
  }

  return fauxInstance.context;
}

export function getTempFauxInstance(fauxInstance, props) {
  return {
    props,
    context: getContext(fauxInstance),
    providers: getProviders(fauxInstance),
    providerInstances: getProviderInstances(fauxInstance),
    activeQueries: getActiveQueries(fauxInstance),
    queryResults: getQueryResults(fauxInstance),
    partialStates: getPartialStates(fauxInstance)
  };
}

export function getFromContextOrProps(fauxInstance, key, defaultValue) {
  if (typeof fauxInstance[key] === 'undefined') {
    const { props } = fauxInstance;
    const context = getContext(fauxInstance);

    if (typeof props[key] !== 'undefined') {
      fauxInstance[key] = props[key];
    } else if (typeof context[key] !== 'undefined') {
      fauxInstance[key] = context[key];
    } else {
      fauxInstance[key] = defaultValue;
    }
  }

  return fauxInstance[key];
}

export function getProviders(fauxInstance) {
  return getFromContextOrProps(fauxInstance, 'providers', {});
}

export function getProviderInstances(fauxInstance) {
  return getFromContextOrProps(fauxInstance, 'providerInstances', {});
}

export function getActiveQueries(fauxInstance) {
  return getFromContextOrProps(fauxInstance, 'activeQueries', {});
}

export function getQueryResults(fauxInstance) {
  return getFromContextOrProps(fauxInstance, 'queryResults', {});
}

export function getPartialStates(fauxInstance) {
  return getFromContextOrProps(fauxInstance, 'partialStates', {});
}

export function getFunctionOrObject(fauxInstance, key, defaultValue = null) {
  if (typeof fauxInstance[key] !== 'undefined') {
    return fauxInstance[key];
  }

  let value = fauxInstance.props[key];

  if (typeof value === 'function') {
    value = value(fauxInstance);
  }

  fauxInstance[key] = value || defaultValue;

  return fauxInstance[key];
}

export function getQueries(fauxInstance) {
  if (typeof fauxInstance.queries !== 'undefined') {
    return fauxInstance.queries;
  }

  const { props, relevantProviders } = fauxInstance;
  const providers = getProviders(fauxInstance);
  const query = getQuery(fauxInstance);
  let queries = getFunctionOrObject(fauxInstance, 'queries');
  let hasQueries = false;

  if (query) {
    // we need to map the query to relevant provider(s)
    if (!queries) {
      queries = {};
    } else if (typeof props.queries !== 'function') {
      queries = { ...queries };
    }

    for (let key in providers) {
      let provider = providers[key];
      let queryKeys = getRelevantKeys(provider.reducers, query);

      if (queryKeys.length) {
        // provider is relevant, so we map it within the queries object
        if (!queries[key]) {
          queries[key] = {};
        }

        for (let queryKey of queryKeys) {
          queries[key][queryKey] = query[queryKey];
        }
      }
    }
  }

  for (let key in queries) {
    let query = queries[key];

    if (typeof query === 'function') {
      queries[key] = query(fauxInstance);
    }

    // make sure each provider is instantiated
    instantiateProvider(fauxInstance, providers[key]);
    hasQueries = true;
  }

  if (!hasQueries) {
    queries = null;

    if (props.query) {
      props.result = null;
    }

    if (props.queries) {
      props.results = {};
    }
  }

  fauxInstance.queries = queries;
  return queries;
}

export function getQuery(fauxInstance) {
  return getFunctionOrObject(fauxInstance, 'query');
}

export function getQueryOptions(fauxInstance) {
  return getFunctionOrObject(fauxInstance, 'queryOptions');
}

export function getQueriesOptions(fauxInstance) {
  return getFunctionOrObject(fauxInstance, 'queriesOptions', {});
}

// gets all `handleQuery` functions within replicators
export function getQueryHandlers(provider) {
  const queryHandlers = [];
  let { replication } = provider;

  if (replication) {
    if (!Array.isArray(replication)) {
      replication = [ replication ];
    }

    for (let {
      replicator, reducerKeys, baseQuery, baseQueryOptions
    } of replication) {
      if (replicator) {
        if (!Array.isArray(replicator)) {
          replicator = [ replicator ];
        }

        for (let { handleQuery } of replicator) {
          if (handleQuery) {
            queryHandlers.push({
              handleQuery,
              reducerKeys: reducerKeys || Object.keys(provider.reducers),
              baseQuery,
              baseQueryOptions
            });
          }
        }
      }
    }
  }

  return queryHandlers;
}

export function getMergedResult(mergedResult, result) {
  if (Array.isArray(result)) {
    return [ ...(mergedResult || []), ...result ];
  } else if (
    result && typeof result === 'object' && result.constructor === Object
  ) {
    return { ...(mergedResult || {}), ...result };
  } else if (typeof result !== 'undefined') {
    return result;
  } else {
    return mergedResult;
  }
}

export function resultsEqual(result, previousResult) {
  if (result === previousResult) {
    return true;
  }

  if (typeof result !== typeof previousResult) {
    return false;
  }

  if (Array.isArray(result)) {
    if (Array.isArray(previousResult)) {
      let i = 0;
      const length = result.length;

      if (length !== previousResult.length) {
        return false;
      }

      while (i < length) {
        if (!shallowEqual(result[i], previousResult[i])) {
          return false;
        }

        i++;
      }
    } else {
      return false;
    }
  } else if (Array.isArray(previousResult)) {
    return false;
  }

  return shallowEqual(result, previousResult);
}

// this is admittedly a mess... :(
// we're accounting for both synchronous and asynchronous query handling
// where asynchronous results will override the synchronous results
export function handleQueries(fauxInstance, callback, previousResults) {
  let doUpdate = false;
  const queries = getQueries(fauxInstance);

  if (!queries) {
    if (callback) {
      callback(doUpdate);
    }

    return false;
  }

  const { props } = fauxInstance;
  const context = getContext(fauxInstance);
  const { result: originalResult, results: originalResults } = props;
  let validQuery = false;

  // for determining whether or not we should update
  if (!previousResults) {
    previousResults = { ...props.results };
  }

  // get what we need to handle the queries
  const query = getQuery(fauxInstance);
  const queryOptions = getQueryOptions(fauxInstance);
  const queriesOptions = getQueriesOptions(fauxInstance);
  const activeQueries = getActiveQueries(fauxInstance);
  const queryResults = getQueryResults(fauxInstance);
  const partialStates = getPartialStates(fauxInstance);
  const providers = getProviders(fauxInstance);
  const providerInstances = getProviderInstances(fauxInstance);

  // TODO: we should probably do something better at some point
  const setPartialStates = (provider, result) => {
    if (!result || !isServerSide) {
      return;
    }

    for (let partialState of result) {
      let providerKey = provider.key;

      if (typeof providerKey === 'function') {
        providerKey = providerKey({ props: partialState, context });
      }

      if (providerKey !== null && !providerInstances[providerKey]) {
        partialStates[providerKey] = partialState;
      }
    }
  };

  // most queries should be async
  let queryCount = Object.keys(queries).length;
  const queryClear = () => {
    if (--queryCount === 0) {
      // at this point we have all our results
      if (callback) {
        callback(doUpdate);
      }
    }
  };

  // merge each result into `props.result` if using `props.query`
  const setMergedResult = result => {
    if (props.query) {
      props.result = getMergedResult(props.result, result);
    }
  };

  // go ahead and set null value if using `props.query`
  if (props.query) {
    props.result = null;
  }

  // results start out as an empty object
  props.results = {};

  // check each query
  Object.keys(queries).forEach(key => {
    const provider = providers[key];
    const queryHandlers = getQueryHandlers(provider);
    let handlerCount = queryHandlers.length;

    // no handlers?  Y U DO DIS?
    if (!handlerCount) {
      queryClear();
      return;
    }

    validQuery = true;

    // let the provider know we're waiting for all of the handlers to finish
    if (Array.isArray(provider.wait)) {
      provider.wait.forEach(fn => fn());
    } else if (provider.wait) {
      provider.wait();
    }

    // here we determine the `resultKey` used for caching the results
    // in the current context
    const query = queries[key];
    const options = queryOptions || queriesOptions[key] || {};
    const resultKey = JSON.stringify({ query, options });
    const queryResult = queryResults[resultKey];
    let queryResultExists = typeof queryResult !== 'undefined';

    // subscribe to all of this provider's instances' stores for requeries
    subscribeToAll(key, provider, fauxInstance, resultKey, query, callback);

    // result handler for both sync and async queries
    const setResult = result => {
      const first = activeQueries[resultKey].values().next().value;
      const leader = setResult === first;
      const previousResult = queryResultExists
        ? queryResult
        : previousResults[key];
      const { asyncReset } = setResult;

      // if new result, set `doUpdate` flag
      if (!doUpdate && !resultsEqual(result, previousResult)) {
        doUpdate = true;
      }

      // a special `asyncReset` flag is set if async handler is detected;
      // we want async results to override sync
      if (asyncReset) {
        // this should only occur once, at the start of setting async results
        setResult.asyncReset = false;

        props.results = {};

        if (props.query) {
          props.result = null;
        }
      }

      props.results[key] = result;
      previousResults[key] = result;
      queryResults[resultKey] = result;
      setMergedResult(result);

      // if this handler is the leader, we pass the result onto the others
      if (leader && activeQueries[resultKey]) {
        activeQueries[resultKey].forEach(otherSetResult => {
          if (otherSetResult !== setResult) {
            otherSetResult(result);
          }
        });
      }

      if (--handlerCount === 0) {
        // handler is done, so remove self
        activeQueries[resultKey].delete(setResult);

        // if there are no handlers remaining, this query is no longer active
        if (!activeQueries[resultKey].size) {
          delete activeQueries[resultKey];
          setPartialStates(provider, result);
        }

        // no more query handlers, so let the provider know we're done
        if (Array.isArray(provider.clear)) {
          provider.clear.forEach(fn => fn(doUpdate));
        } else if (provider.clear) {
          provider.clear(doUpdate);
        }

        // and this query is clear
        queryClear();

        // we want to remove the cached query results on the client/tests
        // so that it will always update
        if (!isServerSide || isTesting) {
          delete queryResults[resultKey];
        }
      }
    };

    const setError = error => {
      console.error(error);
    };

    // this query is currently taking place, make the handler follow the leader
    if (activeQueries[resultKey]) {
      activeQueries[resultKey].add(setResult);
      return;
    }

    // this is a new query, so this handler is a leader;
    // other handlers matching this `resultKey` will check
    // if the query is active and become a follower
    activeQueries[resultKey] = new Set();
    activeQueries[resultKey].add(setResult);

    // already have our query result cached?
    // no point in calling any handlers; go ahead and set the result
    if (queryResultExists) {
      handlerCount = 1;
      setResult(queryResult);
      return;
    }

    // now we need to run the query through each `handleQuery` function,
    // which may or may not be synchronous
    queryHandlers.forEach(
      ({ handleQuery, reducerKeys, baseQuery, baseQueryOptions }) => {
        // we can determine whether or not its synchronous by checking the 
        // `handlerCount` immediately after `handleQuery` is called
        const handlerCountBefore = handlerCount;

        // normalize the query + options so that people can be lazy
        const normalizedQuery = { ...baseQuery, ...query };
        const normalizedOptions = { ...baseQueryOptions, ...options };

        if (typeof normalizedOptions.select === 'undefined') {
          normalizedOptions.select = reducerKeys === true
            ? Object.keys(provider.reducers)
            : reducerKeys;
        } else if (!Array.isArray(normalizedOptions.select)) {
          normalizedOptions.select = [ normalizedOptions.select ];
        }

        if (Array.isArray(normalizedOptions.select)) {
          for (let reducerKey in normalizedQuery) {
            if (normalizedOptions.select.indexOf(reducerKey) < 0) {
              normalizedOptions.select.push(reducerKey);
            }
          }
        }

        handleQuery({
          query: normalizedQuery,
          options: normalizedOptions,
          setResult,
          setError
        });

        if (handlerCount === handlerCountBefore) {
          // asynchronous query, so we set the `asyncReset` flags to true
          // only if they haven't been set to false yet
          activeQueries[resultKey].forEach(setResult => {
            setResult.asyncReset = setResult.asyncReset !== false;
          });
        }
      }
    );
  });

  if (!validQuery) {
    props.result = originalResult;
    props.results = originalResults;
  }

  return validQuery;
}

function subscribeToAll(
  key, provider, fauxInstance, resultKey, query, callback
) {
  if (isServerSide || !fauxInstance.props.__wrapper) {
    return;
  }

  fauxInstance.requeryCallback = callback;

  if (!provider.subscribedFauxInstances) {
    provider.subscribedFauxInstances = {};
  }

  if (provider.subscribedFauxInstances[resultKey]) {
    provider.subscribedFauxInstances[resultKey].add(fauxInstance);
    return;
  }

  const subscribedFauxInstances = new Set();
  provider.subscribedFauxInstances[resultKey] = subscribedFauxInstances;
  subscribedFauxInstances.add(fauxInstance);

  let timeout;
  const requery = providerInstance => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      for (let fauxInstance of subscribedFauxInstances) {
        if (fauxInstance.props.__wrapper.unmounted) {
          subscribedFauxInstances.delete(fauxInstance);
        } else {
          handleQueries(fauxInstance, fauxInstance.requeryCallback);
        }
      }
    });
  };

  pushOnReady({ provider }, requery);

  if (!provider.subscriber) {
    provider.subscriber = {};
  }

  const subscriber = provider.subscriber[key];
  provider.subscriber[key] = (providerInstance, providerInstance2) => {
    if (subscriber) {
      subscriber(providerInstance, providerInstance2);
    }

    if (shouldRequery(providerInstance, query)) {
      requery(providerInstance);
    }
  };

  if (provider.instances) {
    provider.instances.forEach(providerInstance => {
      providerInstance.store.subscribe(() => {
        if (shouldRequery(providerInstance, query)) {
          requery(providerInstance);
        }
      });
    });
  }
}

function shouldRequery(providerInstance, query) {
  const currentState = providerInstance.store.getState();
  const { lastQueriedState } = providerInstance;

  providerInstance.lastQueriedState = currentState;

  if (!lastQueriedState) {
    return true;
  }

  if (currentState !== lastQueriedState) {
    if (typeof query === 'object') {
      for (let key in query) {
        if (currentState[key] !== lastQueriedState[key]) {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  return false;
}
