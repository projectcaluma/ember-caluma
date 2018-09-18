import { Filter, Serializer, register } from "..";
import { camelize } from "@ember/string";
import { MockList } from "graphql-tools";

export default class {
  constructor(type, collection, db) {
    this.type = type;
    this.collection = collection;
    this.db = db;

    this.filter = new Filter(type);
    this.serializer = new Serializer(type);
  }

  getHandlers() {
    const handlers = target => {
      const proto = Reflect.getPrototypeOf(target);
      const res = Object.values(proto);

      return Reflect.getPrototypeOf(proto).isPrototypeOf(Object)
        ? res
        : [...res, ...handlers(proto)];
    };

    return handlers(this).reduce((handlers, handler) => {
      if (typeof handler === "object" && handler.__isHandler) {
        return {
          ...handlers,
          [handler.__handlerFor.replace(/\{type\}/, this.type)]: (...args) =>
            handler.fn.apply(this, args)
        };
      }

      return handlers;
    }, {});
  }

  @register("{type}Connection")
  handleConnection(root, vars) {
    let records = this.filter.filter(
      this.collection,
      this.serializer.deserialize(vars)
    );

    const relKey = `${camelize(this.type)}Ids`;
    if (root && Object(root).hasOwnProperty(relKey)) {
      const ids = root[relKey];
      records = records.filter(({ id }) => (ids || []).includes(id));
    }

    return {
      edges: () =>
        new MockList(records.length, () => ({
          node: (r, v, _, meta) =>
            this.serializer.serialize(records[meta.path.prev.key])
        }))
    };
  }

  @register("{type}")
  handle(root, vars) {
    let record = this.filter.find(
      this.collection,
      this.serializer.deserialize(vars)
    );

    const propKey = camelize(this.type);
    if (root && Object(root).hasOwnProperty(propKey)) {
      return root[propKey];
    }

    return this.serializer.serialize(record);
  }

  @register("Save{type}Payload")
  handleSavePayload(
    _,
    {
      input: { clientMutationId, slug, ...args }
    }
  ) {
    const obj = this.filter.find(this.collection, { slug });

    const res = obj
      ? this.collection.update(obj.id, args)
      : this.collection.insert({ slug, ...args });

    return {
      [camelize(this.type)]: this.serializer.serialize(res),
      clientMutationId
    };
  }
}
