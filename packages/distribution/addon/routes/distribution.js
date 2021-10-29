import Route from "@ember/routing/route";

export default class DistributionRoute extends Route {
  model(params) {
    return params.case;
  }
}
