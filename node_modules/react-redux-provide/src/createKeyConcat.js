export default function createKeyConcat(keys, unshift) {
  let key = keys;
  let getTarget = provider => provider;

  if (Array.isArray(keys)) {
    keys = [].concat(keys);
    key = keys.pop();
    getTarget = provider => keys.reduce((obj, key) => obj[key], provider);
  }

  return function (providers, value) {
    for (let providerKey in providers) {
      let target = getTarget(providers[providerKey]);

      if (target) {
        if (!target[key]) {
          target[key] = [];
        } else if (!Array.isArray(target[key])) {
          target[key] = [ target[key] ];
        }
  
        if (unshift) {
          target[key] = [].concat(value).concat(target[key]);
        } else {
          target[key] = target[key].concat(value);
        }
      }
    }
  }
}
