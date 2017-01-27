import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import replicate from 'redux-replicate';

export function getClientState({ providerKey }) {
  if (typeof window !== 'undefined' && window.clientStates) {
    const clientState = window.clientStates[providerKey];

    if (typeof clientState !== 'undefined') {
      return clientState;
    }
  }

  return null;
}

export function getInitialState({ providerKey, state }) {
  const clientState = getClientState({ providerKey, state });

  if (clientState) {
    delete window.clientStates[providerKey];

    return state ? { ...state, ...clientState } : clientState;
  }

  return state || {};
}

/**
 * Creates and returns a store specifically for some provider instance.
 *
 * @param {Object} providerInstance
 * @param {Mixed} storeKey Optional
 * @param {Object} createState Optional
 * @param {Function} createFunction Optional
 * @param {Object} creatorStore Optional
 * @return {Object}
 * @api public
 */
export default function createProviderStore(
  providerInstance, storeKey, createState, createFunction, creatorStore
) {
  const { reducers, middleware, enhancer, replication } = providerInstance;
  const watchedReducers = {};
  const watching = {};
  let enhancers = [];
  let create;
  let store;
  let setState;
  let settingState;
  let combinedReducers;

  if (typeof storeKey === 'undefined') {
    storeKey = providerInstance.providerKey;
  }

  function unshiftReplication({
    key, reducerKeys, queryable, baseQuery, replicator
  }) {
    if (replicator) {
      if (baseQuery) {
        if (Array.isArray(reducerKeys)) {
          for (let reducerKey in baseQuery) {
            if (reducerKeys.indexOf(reducerKey) < 0) {
              reducerKeys.push(reducerKey);
            }
          }
        }

        if (Array.isArray(queryable)) {
          for (let reducerKey in baseQuery) {
            if (queryable.indexOf(reducerKey) < 0) {
              queryable.push(reducerKey);
            }
          }
        }
      }

      enhancers.unshift(
        replicate({
          key: typeof key === 'undefined' ? storeKey : key,
          reducerKeys,
          queryable,
          replicator,
          create: createFunction || Boolean(createState),
          clientState: getClientState(providerInstance),
          creatorStore
        })
      );
    }
  }

  if (middleware) {
    enhancers.push(applyMiddleware.apply(null, [].concat(middleware)));
  }

  if (enhancer) {
    enhancers = enhancers.concat(enhancer);
  }

  if (replication) {
    if (Array.isArray(replication)) {
      for (let { key } of replication) {
        if (typeof key !== 'undefined') {
          storeKey = key;
          break;
        }
      }

      replication.forEach(unshiftReplication);
    } else {
      unshiftReplication(replication);
    }
  }

  if (enhancers.length) {
    create = compose(...enhancers)(createStore);
  } else {
    create = createStore;
  }

  const initialState = {};
  const preInitialState = {
    ...(createState || getInitialState(providerInstance))
  };

  Object.keys(reducers).forEach(reducerKey => {
    if (typeof preInitialState[reducerKey] !== 'undefined') {
      initialState[reducerKey] = preInitialState[reducerKey];
    }

    watchedReducers[reducerKey] = (state, action) => {
      let nextState;

      if (settingState && typeof settingState[reducerKey] !== 'undefined') {
        nextState = settingState[reducerKey];
      } else {
        nextState = reducers[reducerKey](state, action);
      }

      if (watching[reducerKey] && state !== nextState) {
        watching[reducerKey].forEach(fn => fn(nextState));
      }

      return nextState;
    };
  });

  combinedReducers = combineReducers(watchedReducers);
  store = create(combinedReducers, initialState);

  // we use a custom `watch` method with instead of a replicator
  // since it's slightly more efficient and every clock cycle counts,
  // especially with potentially thousands or even millions of components
  store.watch = (reducerKey, fn) => {
    if (!watching[reducerKey]) {
      watching[reducerKey] = new Set();
    }

    watching[reducerKey].add(fn);

    return () => watching[reducerKey].delete(fn);
  };

  setState = store.setState;
  store.setState = (...args) => {
    const [ nextState ] = args;
    const state = store.getState();

    if (setState) {
      for (let reducerKey in nextState) {
        let current = state[reducerKey];
        let next = nextState[reducerKey];

        if (watching[reducerKey] && current !== next) {
          watching[reducerKey].forEach(fn => fn(next));
        }
      }

      setState(...args);
    } else {
      settingState = nextState;
      store.replaceReducer(combinedReducers);
      settingState = null;
    }
  };

  return store;
}
