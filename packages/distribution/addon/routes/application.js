import Route from "@ember/routing/route";

export default class ApplicationRoute extends Route {
  model(params) {
    return params.case;
  }
}
