import React, { Component, PropTypes } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import shallowEqual from './shallowEqual';
import getRelevantKeys from './getRelevantKeys';
import instantiateProvider from './instantiateProvider';
import { handleQueries, getTempFauxInstance } from './instantiateProvider';

const isServerSide = typeof window === 'undefined';
const allComponentInstances = [];

const contextTypes = {
  providers: PropTypes.object,
  providerInstances: PropTypes.object,
  activeQueries: PropTypes.object,
  queryResults: PropTypes.object,
  partialStates: PropTypes.object,
  forceDeepUpdate: PropTypes.bool
};

export default function provide(ComponentClass) {
  if (ComponentClass.ComponentClass) {
    return ComponentClass;
  }

  let componentName = ComponentClass.displayName || ComponentClass.name;

  function getDisplayName(providers = {}) {
    return `Provide${componentName}(${Object.keys(providers).join(',')})`;
  }

  const Provide = class extends Component {
    static ComponentClass = ComponentClass;
    static displayName = getDisplayName();
    static propTypes = contextTypes;
    static contextTypes = contextTypes;
    static childContextTypes = contextTypes;

    getChildContext() {
      return {
        providers: this.getProviders(),
        providerInstances: this.getProviderInstances(),
        activeQueries: this.getActiveQueries(),
        queryResults: this.getQueryResults(),
        partialStates: this.getPartialStates(),
        forceDeepUpdate: this.forceDeepUpdate
      };
    }

    getProviders(props = this.props, context = this.context) {
      this.providers = this.providers
        || props.providers
        || context.providers
        || {};

      return this.providers;
    }

    getProviderInstances(props = this.props, context = this.context) {
      this.providerInstances = this.providerInstances
        || props.providerInstances
        || context.providerInstances
        || {};

      return this.providerInstances;
    }

    getActiveQueries(props = this.props, context = this.context) {
      this.activeQueries = this.activeQueries
        || props.activeQueries
        || context.activeQueries
        || {};

      return this.activeQueries;
    }

    getQueryResults(props = this.props, context = this.context) {
      this.queryResults = this.queryResults
        || props.queryResults
        || context.queryResults
        || {};

      return this.queryResults;
    }

    getPartialStates(props = this.props, context = this.context) {
      this.partialStates = this.partialStates
        || props.partialStates
        || context.partialStates
        || {};

      return this.partialStates;
    }

    constructor(props, context) {
      super(props);

      if (!isServerSide && !context.providers) {
        window.rootInstance = this;
        this.initializeClientStates(props, context);
      }

      this.renders = 0;
      this.componentName = componentName;
      this.unmounted = true;
      this.initialize(props, context);
    }

    componentDidMount() {
      this.unmounted = isServerSide;
    }

    componentWillUnmount() {
      this.unmounted = true;
      this.deinitialize();
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps, this.props)) {
        this.deinitialize();
        this.initialize(nextProps, this.context);
        this.receivedNewProps = true;
      }
    }

    shouldComponentUpdate() {
      if (this.forceDeepUpdate || this.context.forceDeepUpdate) {
        return true;
      } else if (this.receivedNewProps) {
        this.receivedNewProps = false;
        return true;
      } else {
        return false;
      }
    }

    render = isServerSide
      ? () => {
        const wrappedInstance = this.getWrappedInstance();

        this.deinitialize();
        return wrappedInstance;
      }
      : () => this.getWrappedInstance();

    update() {
      if (!this.unmounted) {
        this.forceUpdate();
      }
    }

    // TODO: improve this
    initializeClientStates(props = this.props, context = this.context) {
      const { clientStates } = window;
      const fauxInstance = this.getFauxInstance(props, context);
      const providers = this.getProviders(props, context);
      const findProvider = props => {
        for (let key in providers) {
          let provider = providers[key];

          if (getRelevantKeys(provider.reducers, props).length) {
            if (typeof provider.defaultKey === 'undefined') {
              provider.defaultKey = key;
            }
            if (typeof provider.key === 'undefined') {
              provider.key = provider.defaultKey;
            }

            return provider;
          }
        }
      };

      if (clientStates) {
        for (let providerKey in clientStates) {
          let state = clientStates[providerKey];

          instantiateProvider(
            getTempFauxInstance(fauxInstance, state),
            findProvider(state)
          );
        }
      }
    }

    initialize(props = this.props, context = this.context) {
      const providers = this.getProviders(props, context);

      this.relevantProviders = {};

      for (let key in providers) {
        let provider = providers[key];
        let shouldSubscribe = false;

        if (typeof provider.defaultKey === 'undefined') {
          provider.defaultKey = key;
        }
        if (typeof provider.key === 'undefined') {
          provider.key = provider.defaultKey;
        }

        this.assignActionCreators(props, context, provider);

        if (this.assignReducers(props, context, provider)) {
          shouldSubscribe = true;
        }

        if (this.assignMergers(props, context, provider)) {
          shouldSubscribe = true;
        }

        if (shouldSubscribe) {
          this.subscribeToProvider(props, context, provider);
        }
      }

      this.handleQueries(props, context);
      this.setDisplayName(props, context);

      if (this.doUpdate) {
        this.update();
      }
    }

    deinitialize() {
      this.unsubscribe();

      delete this.relevantProviders;
      delete this.componentProps;
      delete this.fauxInstance;
      delete this.subbedAll;
      delete this.query;
      delete this.queryOptions;
      delete this.queries;
      delete this.queriesOptions;
      delete this.subscriptions;
      delete this.mergers;
      delete this.wrappedInstance;
    }

    unsubscribe() {
      const subscriptions = this.getSubscriptions();

      while (subscriptions.length) {
        let unsubscribe = subscriptions.shift();

        unsubscribe();
      }
    }

    setDisplayName(props, context) {
      Provide.displayName = getDisplayName(this.relevantProviders);
    }

    getComponentProps(props = this.props, context = this.context) {
      if (!this.componentProps) {
        this.componentProps = {
          ...ComponentClass.defaultProps, ...props, __wrapper: this
        };

        if (!this.componentProps.ref && ComponentClass.prototype.render) {
          this.componentProps.ref = 'wrappedInstance';
        }
      }

      return this.componentProps;
    }

    getFauxInstance(props, context) {
      if (!this.fauxInstance) {
        const componentProps = this.getComponentProps(props, context);

        this.getProviders(props, context);
        this.getProviderInstances(props, context);
        this.getActiveQueries(props, context);
        this.getQueryResults(props, context);
        this.getPartialStates(props, context);
        this.getSubscriptions(props, context);
        this.fauxInstance = { ...this, props: componentProps };
      }

      this.fauxInstance.context = context;

      return this.fauxInstance;
    }

    getSubscriptions() {
      if (!this.subscriptions) {
        this.subscriptions = [];
      }

      return this.subscriptions;
    }

    getMergers() {
      if (!this.mergers) {
        this.mergers = {};
      }

      return this.mergers;
    }

    getWrappedInstance() {
      if (this.context.forceDeepUpdate) {
        this.doUpdate = true;
      }

      if (!this.wrappedInstance || this.doUpdate) {
        this.renders++;
        this.doUpdate = false;
        this.wrappedInstance = (
          <ComponentClass { ...this.getComponentProps() } />
        );
      }

      return this.wrappedInstance;
    }

    getProviderInstance(props, context, provider, getReducerKeys) {
      return instantiateProvider({
        fauxInstance: this.getFauxInstance(props, context),
        provider,
        getReducerKeys
      });
    }

    assignActionCreators(props, context, provider) {
      const actionKeys = getRelevantKeys(
        provider.actions,
        ComponentClass.propTypes
      );

      if (!actionKeys.length) {
        return false;
      }

      const componentProps = this.getComponentProps(props, context);
      const { actionCreators } = this.getProviderInstance(
        props, context, provider, true
      );

      // assign relevant action creators to wrapped component's props
      for (let actionKey of actionKeys) {
        if (!props[actionKey]) {
          componentProps[actionKey] = actionCreators[actionKey];
        }
      }

      return true;
    }

    assignReducers(props, context, provider) {
      const reducerKeys = getRelevantKeys(
        provider.reducers,
        ComponentClass.propTypes
      );

      if (!reducerKeys.length) {
        return false;
      }

      const getReducerKeys = {};
      let shouldSubscribe = false;

      for (let reducerKey of reducerKeys) {
        if (!props[reducerKey]) {
          getReducerKeys[reducerKey] = true;
          shouldSubscribe = true;
        }
      }

      if (!shouldSubscribe) {
        return false;
      }

      const subscriptions = this.getSubscriptions();
      const componentProps = this.getComponentProps(props, context);
      const { store } = this.getProviderInstance(
        props, context, provider, getReducerKeys
      );
      const state = store.getState();

      // copy the relevant states to the wrapped component's props
      // and whenever some state changes, update (mutate) the wrapped props
      // and raise the `doUpdate` flag to indicate that the component
      // should be updated after the action has taken place
      for (let reducerKey in getReducerKeys) {
        componentProps[reducerKey] = state[reducerKey];

        subscriptions.push(
          store.watch(
            reducerKey, nextState => {
              componentProps[reducerKey] = nextState;
              this.doUpdate = true;
            }
          )
        );
      }

      return true;
    }

    assignMergers(props, context, provider) {
      const { merge } = provider;
      const mergeKeys = getRelevantKeys(
        merge,
        ComponentClass.propTypes
      );

      if (!mergeKeys.length) {
        return false;
      }

      const getReducerKeys = {};
      let shouldSubscribe = false;

      for (let mergeKey of mergeKeys) {
        if (!props[mergeKey]) {
          let merger = merge[mergeKey];

          for (let reducerKey of merger.keys) {
            getReducerKeys[reducerKey] = true;
            shouldSubscribe = true;
          }
        }
      }

      if (!shouldSubscribe) {
        return false;
      }

      const mergers = this.getMergers();
      const subscriptions = this.getSubscriptions();
      const componentProps = this.getComponentProps(props, context);
      const { store } = this.getProviderInstance(
        props, context, provider, getReducerKeys
      );
      const state = store.getState();

      // some of the wrapped component's props might depend on some state,
      // possibly merged with props and/or context,
      // so we watch for changes to certain `keys`
      // and only update props when those `keys` have changed
      for (let mergeKey of mergeKeys) {
        if (!props[mergeKey]) {
          let merger = merge[mergeKey];

          componentProps[mergeKey] = merger.get(
            state, componentProps, context
          );

          for (let reducerKey of merger.keys) {
            subscriptions.push(
              store.watch(
                reducerKey, nextState => {
                  // we store the merger temporarily so that we may
                  // `get` the value only after the action has completed
                  mergers[mergeKey] = merger;
                  this.doMerge = true;
                }
              )
            );
          }
        }
      }

      return true;
    }

    subscribeToProvider(props, context, provider) {
      const subscriptions = this.getSubscriptions();
      const { store } = this.getProviderInstance(
        props, context, provider
      );

      // if any states are relevant, we subscribe to the provider's store;
      // and since we're reflecting any changes to relevant states
      // by mutating `componentProps` and raising the `doUpdate` flag,
      // it's more efficient to simply call `forceUpdate` here
      subscriptions.push(
        store.subscribe(() => {
          if (this.doMerge) {
            const mergers = this.getMergers();
            const componentProps = this.getComponentProps(props, context);
            const state = store.getState();

            // this is where we `get` any new values which depend on
            // some state, possibly merged with props and/or context
            for (let mergeKey in mergers) {
              let { get } = mergers[mergeKey];
              let value = get(state, componentProps, context);

              if (componentProps[mergeKey] !== value) {
                componentProps[mergeKey] = value;
                this.doUpdate = true;
              }

              delete mergers[mergeKey];
            }

            this.doMerge = false;
          }

          if (this.doUpdate) {
            this.handleQueries(props, context);
            this.setDisplayName(props, context);
            this.update();
          }
        })
      );
    }

    handleQueries(props, context) {
      const fauxInstance = this.getFauxInstance(props, context);

      return handleQueries(fauxInstance, doUpdate => {
        if (doUpdate) {
          // TODO: should mergers be checked (again) ??
          this.doUpdate = true;
          this.update();
        }
      });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    let componentInstances = ComponentClass.__componentInstances;

    if (typeof componentInstances === 'undefined') {
      componentInstances = new Set();
      ComponentClass.__componentInstances = componentInstances;
      allComponentInstances.push(componentInstances);
    }

    ComponentClass.Provide = Provide;
    ComponentClass.setComponentClass = function(NextClass) {
      componentInstances = ComponentClass.__componentInstances;
      NextClass.__componentInstances = componentInstances;
      ComponentClass = NextClass;
      Provide.ComponentClass = ComponentClass;
      componentName = ComponentClass.displayName || ComponentClass.name;
    };

    Provide.prototype.componentDidMount = function() {
      this.unmounted = isServerSide;
      componentInstances.add(this);
    }

    Provide.prototype.componentWillUnmount = function() {
      this.unmounted = true;
      this.deinitialize();
      componentInstances.delete(this);
    }

    Provide.prototype.reinitialize = function(props, context, NextClass) {
      if (NextClass) {
        this.setComponentClass(NextClass);
      }

      setTimeout(() => {
        this.doUpdate = true;
        this.deinitialize();
        this.initialize(props, context);
      });
    }

    Provide.prototype.setComponentClass = function(NextClass) {
      Provide.setComponentClass(NextClass);
      this.componentName = componentName;
    }

    for (let componentInstance of componentInstances) {
      const { props, context } = componentInstance;

      componentInstance.reinitialize(props, context, ComponentClass);
    }
  }

  return hoistStatics(Provide, ComponentClass);
}

export function reloadFunctions(oldFunctions, newFunctions) {
  for (let key in newFunctions) {
    let newFunction = newFunctions[key];
    let oldFunction = oldFunctions[key];

    if (
      typeof newFunction === 'function'
      && newFunction.propTypes && !newFunction.Provide
      && oldFunction && oldFunction.Provide
    ) {
      newFunction.Provide = provide(newFunction);
      oldFunction.setComponentClass(newFunction);
      newFunction.setComponentClass = oldFunction.setComponentClass;

      for (let componentInstance of oldFunction.__componentInstances) {
        let { props, context } = componentInstance;

        componentInstance.forceDeepUpdate = true;
        componentInstance.reinitialize(props, context, newFunction);
        componentInstance.forceDeepUpdate = false;
      }
    }
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn('You should only use `reloadInstances` in development!');
  }
}

export function reloadProviders(providers, providerInstances) {
  const { rootInstance, clientStates } = window;
  const {
    providers: oldProviders,
    providerInstances: oldProviderInstances
  } = rootInstance;

  for (let key in providers) {
    let provider = providers[key];
    let oldProvider = oldProviders[key];

    if (!providers.replication && oldProvider && oldProvider.replication) {
      provider.replication = oldProvider.replication;
    }
  }

  for (let providerKey in oldProviderInstances) {
    let oldProviderInstance = oldProviderInstances[providerKey];

    if (clientStates) {
      clientStates[providerKey] = oldProviderInstance.store.getState();
    }

    delete oldProviderInstances[providerKey];
  }

  rootInstance.providers = providers;
  rootInstance.providerInstances = providerInstances || oldProviderInstances;
  rootInstance.reinitialize(rootInstance.props, rootInstance.context);

  for (let componentInstances of allComponentInstances) {
    for (let componentInstance of componentInstances) {
      let { props, context } = componentInstance;

      if (componentInstance !== rootInstance) {
        context.providers = rootInstance.providers;
        context.providerInstances = rootInstance.providerInstances;
        componentInstance.providers = rootInstance.providers;
        componentInstance.providerInstances = rootInstance.providerInstances;
        componentInstance.reinitialize(props, context);
      }
    }
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn('You should only use `reloadProviders` in development!');
  }
}
