import Route from "@ember/routing/route";

export default class ReportsEditPreviewRoute extends Route {
  model() {
    return this.modelFor("reports.edit");
  }
}
