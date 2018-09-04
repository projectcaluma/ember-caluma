import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import { graphql } from "graphql";
import { MockList } from "graphql-tools";
import { classify, camelize } from "@ember/string";
import { singularize } from "ember-inflector";
import rawSchema from "./schema";
import config from "../config/environment";

const serialize = (obj, className) => {
  let { id = null, slug = null } = obj;
  let o = Object.assign({}, obj);

  delete o.id;
  delete o.slug;

  return (
    (id &&
      slug &&
      Object.assign(o, {
        slug,
        id: btoa(`${className}:${slug}`)
      })) ||
    obj
  );
};

const deserialize = obj => {
  let { id = null } = obj;
  let o = Object.assign({}, obj);

  delete o.id;

  return (
    (id &&
      Object.assign(o, {
        slug: atob(id).split(":")[1]
      })) ||
    obj
  );
};

export default function() {
  this.urlPrefix = ""; // make this `http://localhost:8080`, for example, if your API is on a different server
  this.namespace = ""; // make this `/api`, for example, if your API is namespaced
  this.timing = 400; // delay for each request, automatically set to 0 during testing

  this.post(
    config.apollo.apiURL,
    (srv, request) => {
      const { db } = srv;

      const classes = db._collections.map(({ name }) => ({
        cls: classify(singularize(name)),
        collection: name
      }));

      const mocks = classes.reduce((mocks, { cls, collection }) => {
        return Object.assign(mocks, {
          [`${cls}Connection`]: (root, vars) => {
            let records = db[collection].where(deserialize(vars));

            return {
              edges: () =>
                new MockList(records.length, () => ({
                  node: (r, v, _, meta) =>
                    serialize(records[meta.path.prev.key], cls)
                }))
            };
          },
          [cls]: (root, vars, _, { path: { prev } }) => {
            if (root && root[camelize(cls)]) {
              return root[camelize(cls)];
            }

            let record = db[collection].where(deserialize(vars))[
              (prev && prev.key) || 0
            ];

            return serialize(record, cls);
          },
          [`Save${cls}Payload`]: (root, { input }) => {
            let { clientMutationId, slug } = input;

            delete input.clientMutationId;

            let model = srv[collection];
            let obj = model.findBy({ slug }) || model.create(input);

            obj.update(input);

            return {
              [camelize(cls)]: serialize(obj.toJSON(), cls),
              clientMutationId
            };
          },
          [`Archive${cls}Payload`]: (
            root,
            { input: { clientMutationId, id } }
          ) => {
            let model = srv[collection];

            let obj = model.findBy(deserialize({ id }));

            obj.update({ isArchived: true });

            return {
              [camelize(cls)]: serialize(obj.toJSON(), cls),
              clientMutationId
            };
          }
        });
      }, {});

      let schema = makeExecutableSchema({
        typeDefs: rawSchema,
        resolverValidationOptions: { requireResolversForResolveType: false }
      });

      let { query, variables } = JSON.parse(request.requestBody);

      addMockFunctionsToSchema({
        schema,
        mocks: Object.assign(mocks, {
          Node: (_, { id }) => ({ __typename: atob(id).split(":")[0] })
        }),
        preserveResolvers: false
      });

      return graphql(schema, query, null, null, variables);
    },
    200
  );

  this.passthrough();
}
