import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import { graphql } from "graphql";
import { classify } from "@ember/string";
import { singularize } from "ember-inflector";
import rawSchema from "./schema";
import resolvers from "./resolvers";
import { Mock } from ".";

export default function() {
  return function({ db }, request) {
    const mocks = db._collections.reduce((m, { name }) => {
      const cls = classify(singularize(name));
      const mock = new Mock(cls, db[name], db);

      return { ...m, ...mock.getHandlers() };
    }, {});

    let schema = makeExecutableSchema({
      typeDefs: rawSchema,
      resolvers,
      resolverValidationOptions: { requireResolversForResolveType: false }
    });

    let { query, variables } = JSON.parse(request.requestBody);

    addMockFunctionsToSchema({
      schema,
      mocks: {
        ...mocks,
        Node: (_, { id }) => ({ __typename: atob(id).split(":")[0] })
      },
      preserveResolvers: false
    });

    return graphql(schema, query, null, null, variables);
  };
}
