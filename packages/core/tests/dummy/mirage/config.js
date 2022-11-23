import { discoverEmberDataModels } from "ember-cli-mirage";
import { createServer } from "miragejs";
import ApplicationSerializer from "./serializers/application";

import graphqlHandler from "@projectcaluma/ember-testing/mirage-graphql";

export default function makeServer(config) {
  return createServer({
    ...config,
    models: { ...discoverEmberDataModels(), ...config.models },
    routes() {
      this.logging = true;
      this.get("/topics", "communicationTopics");
      this.post("/graphql/", graphqlHandler(this), 200);
    },
  });
}
