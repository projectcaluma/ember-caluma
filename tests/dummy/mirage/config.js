import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import { graphql } from "graphql";
import { MockList } from "graphql-tools";
import { classify } from "@ember/string";
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
    ({ db, forms }, request) => {
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
            if (root && root.form && root.form) {
              return root.form;
            }

            let record = db[collection].where(deserialize(vars))[
              (prev && prev.key) || 0
            ];

            return serialize(record, cls);
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
          Node: (_, { id }) => ({ __typename: atob(id).split(":")[0] }),
          DeleteFormPayload: (root, { input: { clientMutationId, id } }) => {
            let form = forms.findBy(deserialize({ id }));

            form.destroy();

            return { form, clientMutationId };
          },
          SaveFormPayload: (root, { input }) => {
            let { clientMutationId, slug } = input;

            delete input.clientMutationId;

            let form = forms.findBy({ slug }) || forms.create(input);

            form.update(input);

            return {
              form: serialize(form.toJSON(), "Form"),
              clientMutationId
            };
          }
        }),
        preserveResolvers: false
      });

      return graphql(schema, query, null, null, variables);
    },
    200
  );

  this.passthrough();
}
