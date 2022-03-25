import { classify } from "@ember/string";
import { singularize } from "ember-inflector";
import { graphql } from "graphql";
import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date";
import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import { DateTime } from "luxon";

import createMock from "@projectcaluma/ember-testing/mirage-graphql/mocks";
import typeDefs from "@projectcaluma/ember-testing/mirage-graphql/schema.graphql";

export default function createGraphqlHandler(server) {
  return function graphqlHandler({ db }, request) {
    const mocks = db._collections.reduce((m, { name }) => {
      const cls = classify(singularize(name));
      const mock = createMock(cls, server);

      return { ...m, ...mock.getHandlers() };
    }, {});

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        Date: GraphQLDate,
        DateTime: GraphQLDateTime,
        GenericScalar: {
          serialize(value) {
            return typeof value === "string" ? JSON.parse(value) : value;
          },
        },
      },
      resolverValidationOptions: { requireResolversForResolveType: false },
    });

    const { query, variables } = JSON.parse(request.requestBody);

    addMockFunctionsToSchema({
      schema,
      mocks: {
        ...mocks,
        JSONString: () => JSON.stringify({}),
        DateTime: DateTime.now().toISO(),
        GenericScalar: () => ({}),
        Node: (_, { id }) => ({ __typename: atob(id).split(":")[0] }),
        SelectedOption: ({ value }) => {
          const option = server.schema.options.findBy({ slug: value });

          return {
            slug: value,
            label: option.label,
            __typename: "SelectedOption",
          };
        },
      },
      preserveResolvers: false,
    });

    return graphql(schema, query, null, null, variables);
  };
}
