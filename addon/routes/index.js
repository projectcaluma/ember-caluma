import Route from "@ember/routing/route";
import { RouteQueryManager } from "ember-apollo-client";

export default Route.extend(RouteQueryManager, {
  model() {}
});
