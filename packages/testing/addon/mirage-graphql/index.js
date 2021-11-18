import { dasherize, classify } from "@ember/string";
import require from "require";

const importTypeOrBase = (path, type) => {
  try {
    return require(`${path}/${dasherize(type)}`).default;
  } catch (e) {
    return require(`${path}/base`).default;
  }
};

export const register = (tpl) => (target, name, descriptor) => {
  if (descriptor.value.__isHandler) {
    descriptor.value.__handlerFor.push(tpl);
    return descriptor;
  }

  descriptor.writable = false;
  descriptor.enumerable = true;

  descriptor.value = {
    __isHandler: true,
    // Mocks can have multiple handlers per type.
    __handlerFor: [tpl],
    fn: descriptor.value,
  };

  return descriptor;
};

export const serialize = (deserialized = {}, type) => {
  const __typename = [deserialized.type?.toLowerCase(), type]
    .filter(Boolean)
    .map(classify)
    .join("");

  return {
    ...deserialized,
    id: btoa(`${__typename}:${deserialized.id}`),
    __typename,
  };
};

export const deserialize = (serialized) => {
  let decodedId = serialized.id;

  try {
    decodedId = atob(serialized.id).split(":")[1] || serialized.id;
  } catch (e) {
    // this is expected most times
  }

  return { ...serialized, ...(decodedId ? { id: decodedId } : {}) };
};

export const Filter = function (type, ...args) {
  return new (importTypeOrBase("./filters", type))(type, ...args);
};

export const Mock = function (type, ...args) {
  return new (importTypeOrBase("./mocks", type))(type, ...args);
};

export { default } from "./handler";
