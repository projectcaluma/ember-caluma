import config from "../config/environment";

import graphqlHandler from "@projectcaluma/ember-testing/mirage-graphql";

export default function () {
  this.post(config.apollo.apiURL, graphqlHandler(this), 200);
}
