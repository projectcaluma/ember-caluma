import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import { graphql } from "graphql";
import { classify } from "@ember/string";
import { singularize } from "ember-inflector";
import rawSchema from "ember-caluma/mirage-graphql/schema";
import resolvers from "ember-caluma/mirage-graphql/resolvers";
import { Mock } from "ember-caluma/mirage-graphql";

export default function(server) {
  return function({ db }, request) {
    const mocks = db._collections.reduce((m, { name }) => {
      const cls = classify(singularize(name));
      const mock = new Mock(cls, db[name], db, server);

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
        JSONString: () => JSON.stringify({}),
        GenericScalar: () => ({}),
        Node: (_, { id }) => ({ __typename: atob(id).split(":")[0] })
      },
      preserveResolvers: false
    });

    return graphql(schema, query, null, null, variables);
  };
}
