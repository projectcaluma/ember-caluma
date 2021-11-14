import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class DemoAnalyticsIndexController extends Controller {
  @service router;

  @action
  createTable() {
    this.router.transitionTo("demo.analytics.builder", "new");
  }
}
