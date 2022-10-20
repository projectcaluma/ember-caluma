import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service distribution;

  model(params) {
    return params.case;
  }

  afterModel(model) {
    this.distribution.caseId = model;
  }
}
