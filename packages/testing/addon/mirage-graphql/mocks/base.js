import { camelize, dasherize, classify } from "@ember/string";
import { faker } from "@faker-js/faker";
import { singularize, pluralize } from "ember-inflector";
import { MockList } from "graphql-tools";

import {
  Filter,
  register,
  serialize,
  deserialize,
} from "@projectcaluma/ember-testing/mirage-graphql";

export const ANSWER_TYPES = [
  "DATE",
  "FILE",
  "FLOAT",
  "INTEGER",
  "LIST",
  "STRING",
  "TABLE",
];

export const QUESTION_TYPES = [
  "ACTION_BUTTON",
  "CALCULATED_FLOAT",
  "CHOICE",
  "DATE",
  "DYNAMIC_CHOICE",
  "DYNAMIC_MULTIPLE_CHOICE",
  "FILE",
  "FLOAT",
  "FORM",
  "INTEGER",
  "MULTIPLE_CHOICE",
  "STATIC",
  "TABLE",
  "TEXT",
  "TEXTAREA",
];

export const TASK_TYPES = [
  "SIMPLE",
  "COMPLETE_WORKFLOW_FORM",
  "COMPLETE_TASK_FORM",
];

export const TYPE_MAPPING = {
  Answer: ANSWER_TYPES,
  Question: QUESTION_TYPES,
  Task: TASK_TYPES,
};

export default class {
  constructor(type, server) {
    this.type = type;
    this.server = server;
    this.schema = server.schema;

    this.filter = new Filter(type);
  }

  get collection() {
    return this.schema[pluralize(camelize(this.type))];
  }

  getHandlers() {
    const types = TYPE_MAPPING[this.type];
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
            const handlerName = target.replace(/\{type\}/, this.type);
            const baseHandlerName = handlerName.replace(/\{subtype\}/, "");
            const fn = (...args) => handler.fn.apply(this, args);

            const newHandlers = types
              ? types.reduce(
                  (typeHandlers, type) => ({
                    ...typeHandlers,
                    [handlerName.replace(
                      /\{subtype\}/,
                      classify(type.toLowerCase())
                    )]: fn,
                  }),
                  {}
                )
              : { [baseHandlerName]: fn };

            return {
              ...targets,
              ...newHandlers,
            };
          }, {}),
        };
      }

      return handlers;
    }, {});
  }

  @register("{type}Connection")
  handleConnection(root, vars, _, { fieldName }) {
    let records = this.filter.filter(
      this.collection.all().models,
      deserialize(vars)
    );

    const relKey = `${singularize(fieldName)}Ids`;
    if (root && Object.prototype.hasOwnProperty.call(root, relKey)) {
      const ids = root[relKey];
      records = records
        .filter(({ id }) => ids && ids.includes(id))
        .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    }

    // add base64 encoded index as cursor to records
    records = records.map((record, index) => ({
      ...record.toJSON(),
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

  @register("{subtype}{type}")
  handle(root, vars, _, { fieldName }) {
    // If the parent node already resolved this branch in the graph, return it
    // directly without mocking it
    if (
      root &&
      fieldName !== "node" &&
      Object.prototype.hasOwnProperty.call(root, fieldName)
    ) {
      return root[fieldName];
    }

    // If the parent node provides an ID for this relation, filter our mock data
    // with that given ID
    const relKey = `${fieldName}Id`;
    if (
      root &&
      fieldName !== "node" &&
      Object.prototype.hasOwnProperty.call(root, relKey)
    ) {
      vars = { id: root[relKey] };
    }

    const record = this.collection.findBy(deserialize(vars));

    return record && serialize(record.toJSON(), this.type);
  }

  @register("Save{subtype}{type}Payload")
  handleSavePayload(
    _,
    { input: { clientMutationId = faker.datatype.uuid(), slug, id, ...args } }
  ) {
    const identifier = slug ? { slug } : { id };

    const relKeys = this.schema.modelFor(camelize(this.type)).foreignKeys;

    const parsedArgs = Object.entries(args).reduce((parsed, [key, value]) => {
      const re = new RegExp(`${camelize(key)}Id(s)?`);
      const relKey = relKeys.find((k) => re.test(k));

      return {
        ...parsed,
        ...(value === undefined ? {} : { [relKey ?? key]: value }),
      };
    }, {});

    const obj = this.collection.findBy(identifier);
    const res = obj
      ? obj.update(deserialize(parsedArgs))
      : this.collection.create(
          this.server.build(
            dasherize(this.type),
            deserialize({
              ...identifier,
              ...parsedArgs,
            })
          )
        );

    return {
      [camelize(this.type)]: serialize(res.toJSON(), this.type),
      clientMutationId,
    };
  }
}
