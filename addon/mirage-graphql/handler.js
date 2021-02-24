import { classify } from "@ember/string";
import { singularize } from "ember-inflector";
import { graphql } from "graphql";
import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import moment from "moment";

import { Mock } from "ember-caluma/mirage-graphql";
import resolvers from "ember-caluma/mirage-graphql/resolvers";
import rawSchema from "ember-caluma/mirage-graphql/schema";

export default function (server) {
  return function ({ db }, request) {
    const mocks = db._collections.reduce((m, { name }) => {
      const cls = classify(singularize(name));
      const mock = new Mock(cls, db[name], db, server);

      return { ...m, ...mock.getHandlers() };
    }, {});

    const schema = makeExecutableSchema({
      typeDefs: rawSchema,
      resolvers,
      resolverValidationOptions: { requireResolversForResolveType: false },
    });

    const { query, variables } = JSON.parse(request.requestBody);

    addMockFunctionsToSchema({
      schema,
      mocks: {
        ...mocks,
        Date: () => moment().format(moment.HTML5_FMT.DATE),
        JSONString: () => JSON.stringify({}),
        GenericScalar: () => ({}),
        Node: (_, { id }) => ({ __typename: atob(id).split(":")[0] }),
      },
      preserveResolvers: false,
    });

    return graphql(schema, query, null, null, variables);
  };
}
