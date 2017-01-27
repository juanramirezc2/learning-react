import createKeyConcat from './createKeyConcat';

const middlewareKey = 'middleware';
export const pushMiddleware = createKeyConcat(middlewareKey);
export const unshiftMiddleware = createKeyConcat(middlewareKey, true);

const enhancerKey = 'enhancer';
export const pushEnhancer = createKeyConcat(enhancerKey);
export const unshiftEnhancer = createKeyConcat(enhancerKey, true);

const onInstantiatedKey = 'onInstantiated';
export const pushOnInstantiated = createKeyConcat(onInstantiatedKey);
export const unshiftOnInstantiated = createKeyConcat(onInstantiatedKey, true);

const onReadyKey = 'onReady';
export const pushOnReady = createKeyConcat(onReadyKey);
export const unshiftOnReady = createKeyConcat(onReadyKey, true);

const replicationKey = 'replication';
export const pushReplication = createKeyConcat(replicationKey);
export const unshiftReplication = createKeyConcat(replicationKey, true);

const replicatorKey = [replicationKey, 'replicator'];
export const pushReplicator = createKeyConcat(replicatorKey);
export const unshiftReplicator = createKeyConcat(replicatorKey, true);

const waitKey = 'wait';
export const pushWait = createKeyConcat(waitKey);
export const unshiftWait = createKeyConcat(waitKey, true);

const clearKey = 'clear';
export const pushClear = createKeyConcat(clearKey);
export const unshiftClear = createKeyConcat(clearKey, true);
