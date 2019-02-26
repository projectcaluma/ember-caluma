import { Filter, Serializer, register } from "ember-caluma/mirage-graphql";
import { camelize, dasherize } from "@ember/string";
import { MockList } from "graphql-tools";

export default class {
  constructor(type, collection, db, server) {
    this.type = type;
    this.collection = collection;
    this.db = db;
    this.server = server;

    this.filter = new Filter(...arguments);
    this.serializer = new Serializer(...arguments);
  }

  getHandlers() {
    const handlers = target => {
      const proto = Reflect.getPrototypeOf(target);
      const res = Object.values(proto);

      return Reflect.getPrototypeOf(proto).isPrototypeOf(Object)
        ? res
        : [...handlers(proto), ...res];
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
      records = records.filter(({ id }) => ids && ids.includes(id));
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
    // If the parent node already resolved this branch in the graph, return it
    // directly without mocking it
    if (root && Object(root).hasOwnProperty(camelize(this.type))) {
      return root[camelize(this.type)];
    }

    // If the parent node provides an ID for this relation, filter our mock data
    // with that given ID
    if (root && Object(root).hasOwnProperty(`${camelize(this.type)}Id`)) {
      vars = { id: root[`${camelize(this.type)}Id`] };
    }

    let record = this.filter.find(
      this.collection,
      this.serializer.deserialize(vars)
    );

    return this.serializer.serialize(record);
  }

  @register("Save{type}Payload")
  handleSavePayload(
    _,
    {
      input: { clientMutationId, slug, id, ...args }
    }
  ) {
    const identifier = slug ? { slug } : { id };

    const obj = this.filter.find(this.collection, identifier);
    const res = obj
      ? this.collection.update(obj.id, args)
      : this.collection.insert(
          this.serializer.deserialize(
            this.server.build(dasherize(this.type), {
              ...identifier,
              ...args
            })
          )
        );

    const x = {
      [camelize(this.type)]: this.serializer.serialize(res),
      clientMutationId
    };

    return x;
  }
}
