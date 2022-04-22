import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
export default class ReportsIndexController extends Controller {
  @service router;

  @action
  createTable() {
    this.router.transitionTo("reports.new");
  }
}
