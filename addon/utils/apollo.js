export function decodeMeta(obj) {
  if (!obj) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(decodeMeta);
  }
  if (typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      if (key === "meta") {
        result[key] = JSON.parse(obj[key]);
      } else if (key.startsWith("_")) {
        result[key] = obj[key];
      } else {
        result[key] = decodeMeta(obj[key]);
      }
      return result;
    }, {});
  }
  return obj;
}
