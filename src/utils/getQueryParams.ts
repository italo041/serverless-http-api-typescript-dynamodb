export function getQueryParams(query: any) {
  const limit = query.limit ? parseInt(query.limit, 10) : 10;
  let lastKey;
  if (query.lastKey) {
    try {
      lastKey = JSON.parse(query.lastKey);
    } catch (e) {
      console.error("Invalid lastKey JSON:", query.lastKey);
      lastKey = undefined;
    }
  } else {
    lastKey = undefined;
  }
  return { limit, lastKey };
}
