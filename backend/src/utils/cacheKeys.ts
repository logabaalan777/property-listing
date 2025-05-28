export function getPropertiesCacheKey(params: any) {
  const sortedKeys = Object.keys(params).sort();
  const keyString = sortedKeys
    .map(k => `${k}=${JSON.stringify(params[k])}`)
    .join(';');
  return `properties:${keyString}`;
}