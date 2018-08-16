import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import { graphql } from "graphql";
import { MockList } from "graphql-tools";
import { classify } from "@ember/string";
import { singularize } from "ember-inflector";

import rawSchema from "./schema";

export default function() {
  this.urlPrefix = ""; // make this `http://localhost:8080`, for example, if your API is on a different server
  this.namespace = ""; // make this `/api`, for example, if your API is namespaced
  this.timing = 400; // delay for each request, automatically set to 0 during testing

  this.post(
    "/graphql",
    ({ db }, request) => {
      const classes = db._collections.map(({ name }) => ({
        cls: classify(singularize(name)),
        collection: name
      }));

      const mocks = classes.reduce((mocks, { cls, collection }) => {
        return Object.assign(mocks, {
          [`${cls}Connection`]: (root, vars) => {
            let records = db[collection].where(vars);

            return {
              edges: () =>
                new MockList(records.length, () => ({
                  node: (r, v, _, meta) => records[meta.path.prev.key]
                }))
            };
          },
          [cls]: (root, vars, _, meta) => {
            let records = db[collection].where(vars);

            return records[meta.path.prev.key];
          }
        });
      }, {});

      let schema = makeExecutableSchema({ typeDefs: rawSchema });
      let { query, variables } = JSON.parse(request.requestBody);

      addMockFunctionsToSchema({
        schema,
        mocks,
        preserveResolvers: false
      });

      return graphql(schema, query, null, null, variables);
    },
    200
  );
}
