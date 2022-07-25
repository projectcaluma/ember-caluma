import { createServer } from "miragejs";

import graphqlHandler from "@projectcaluma/ember-testing/mirage-graphql";

export default function makeServer(config) {
  return createServer({
    ...config,
    routes() {
      this.post("/graphql/", graphqlHandler(this), 200);
    },
  });
}
