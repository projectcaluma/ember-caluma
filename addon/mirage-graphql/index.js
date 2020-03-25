import require from "require";
import { dasherize } from "@ember/string";

const importTypeOrBase = (path, type) => {
  try {
    return require(`${path}/${dasherize(type)}`).default;
  } catch (e) {
    return require(`${path}/base`).default;
  }
};

export const register = (tpl) => (target, name, descriptor) => {
  descriptor.writable = false;
  descriptor.enumerable = true;

  descriptor.value = {
    __isHandler: true,
    __handlerFor: tpl,
    fn: descriptor.value,
  };

  return descriptor;
};

export const Serializer = function (type, ...args) {
  return new (importTypeOrBase("./serializers", type))(type, ...args);
};

export const Filter = function (type, ...args) {
  return new (importTypeOrBase("./filters", type))(type, ...args);
};

export const Mock = function (type, ...args) {
  return new (importTypeOrBase("./mocks", type))(type, ...args);
};

export { default } from "./handler";
