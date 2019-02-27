export function transform(mapping, obj) {
  function walk(obj) {
    if (!obj) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(walk);
    }
    if (typeof obj === "object") {
      return Object.keys(obj).reduce((result, key) => {
        if (key.startsWith("_")) {
          result[key] = obj[key];
        } else if (Object.keys(mapping).includes(key)) {
          result[key] = mapping[key](obj[key]);
        } else {
          result[key] = walk(obj[key]);
        }
        return result;
      }, {});
    }
    return obj;
  }
  return walk(obj);
}

export function decodeMeta(obj) {
  return transform(
    {
      meta: str => JSON.parse(str)
    },
    obj
  );
}
