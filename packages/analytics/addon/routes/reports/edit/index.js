import Route from "@ember/routing/route";

export default class ReportsEditIndexRoute extends Route {
  model() {
    return this.modelFor("reports.edit");
  }
}
