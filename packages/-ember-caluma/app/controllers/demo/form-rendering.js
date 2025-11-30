import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class DemoFormRenderingController extends Controller {
  @service notification;

  queryParams = ["displayedForm"];

  compareTo = new Date(Date.parse("14 May 2024 12:38:10 GMT"));

  @action actionButtonOnSuccess() {
    this.notification.success("Successfully submitted the form!");
  }
}
