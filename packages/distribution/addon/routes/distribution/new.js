import Route from "@ember/routing/route";

export default class DistributionNewRoute extends Route {
  model() {
    return this.modelFor("distribution");
  }
}
