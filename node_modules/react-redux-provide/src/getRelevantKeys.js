export default function getRelevantKeys(a = {}, b = {}) {
  const relevantKeys = [];

  if (typeof b === 'object') {
    for (let key in b) {
      if (key in a) {
        relevantKeys.push(key);
      }
    }
  }

  return relevantKeys;
}
