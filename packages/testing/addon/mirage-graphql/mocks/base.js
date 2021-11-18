import { camelize, dasherize } from "@ember/string";
import { MockList } from "graphql-tools";

import {
  Filter,
  register,
  serialize,
  deserialize,
} from "@projectcaluma/ember-testing/mirage-graphql";

export default class {
  constructor(type, collection, db, server, ...args) {
    this.type = type;
    this.collection = collection;
    this.db = db;
    this.server = server;

    this.filter = new Filter(type, collection, db, server, ...args);
  }

  getHandlers() {
    const handlers = (target) => {
      const proto = Reflect.getPrototypeOf(target);
      const res = Object.values(proto);

      return Object.prototype.isPrototypeOf.call(
        Reflect.getPrototypeOf(proto),
        Object
      )
        ? res
        : [...handlers(proto), ...res];
    };

    return handlers(this).reduce((handlers, handler) => {
      if (typeof handler === "object" && handler.__isHandler) {
        return {
          ...handlers,
          // Mocks can have multiple handlers per type.
          ...handler.__handlerFor.reduce((targets, target) => {
            return {
              ...targets,
              [target.replace(/\{type\}/, this.type)]: (...args) =>
                handler.fn.apply(this, args),
            };
          }, {}),
        };
      }

      return handlers;
    }, {});
  }

  @register("{type}Connection")
  handleConnection(root, vars) {
    let records = this.filter.filter(this.collection, deserialize(vars));

    const relKey = `${camelize(this.type)}Ids`;
    if (root && Object.prototype.hasOwnProperty.call(root, relKey)) {
      const ids = root[relKey];
      records = records.filter(({ id }) => ids && ids.includes(id));
    }

    // add base64 encoded index as cursor to records
    records = records.map((record, index) => ({
      ...record,
      _cursor: btoa(index),
    }));

    const totalCount = records.length;
    const lastCursor = records.slice(-1)[0]?._cursor;

    // extract next page of records
    if (vars.first) {
      const cursorIndex = vars.after
        ? records.findIndex((record) => record._cursor === vars.after) + 1
        : 0;
      records = records.slice(cursorIndex, cursorIndex + vars.first);
    }

    const endCursor = records.slice(-1)[0]?._cursor;
    const hasNextPage = lastCursor !== endCursor;

    return {
      pageInfo: () => {
        return { hasNextPage, endCursor };
      },
      totalCount,
      edges: () =>
        new MockList(records.length, () => ({
          node: (r, v, _, meta) =>
            serialize(records[meta.path.prev.key], this.type),
        })),
    };
  }

  @register("{type}")
  handle(root, vars) {
    // If the parent node already resolved this branch in the graph, return it
    // directly without mocking it
    if (
      root &&
      Object.prototype.hasOwnProperty.call(root, camelize(this.type))
    ) {
      return root[camelize(this.type)];
    }

    // If the parent node provides an ID for this relation, filter our mock data
    // with that given ID
    if (
      root &&
      Object.prototype.hasOwnProperty.call(root, `${camelize(this.type)}Id`)
    ) {
      vars = { id: root[`${camelize(this.type)}Id`] };
    }

    const record = this.filter.find(this.collection, deserialize(vars));

    return record && serialize(record, this.type);
  }

  @register("Save{type}Payload")
  handleSavePayload(_, { input: { clientMutationId, slug, id, ...args } }) {
    const identifier = slug ? { slug } : { id };

    const relKeys = this.server.schema.modelFor(
      this.type.toLowerCase()
    ).foreignKeys;

    const parsedArgs = Object.entries(args).reduce((parsed, [key, value]) => {
      const re = new RegExp(`${camelize(key)}Id(s)?`);
      const relKey = relKeys.find((k) => re.test(k));

      return {
        ...parsed,
        [relKey ?? key]: value,
      };
    }, {});

    const obj = this.filter.find(this.collection, identifier);
    const res = obj
      ? this.collection.update(obj.id, parsedArgs)
      : this.collection.insert(
          this.server.build(
            dasherize(this.type),
            deserialize({
              ...identifier,
              ...parsedArgs,
            })
          )
        );

    return {
      [camelize(this.type)]: serialize(
        {
          ...relKeys.reduce((rels, key) => ({ ...rels, [key]: null }), {}),
          ...res,
        },
        this.type
      ),
      clientMutationId,
    };
  }
}
