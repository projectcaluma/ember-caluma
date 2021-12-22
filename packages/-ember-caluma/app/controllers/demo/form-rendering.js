import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class DemoFormRenderingController extends Controller {
  @service notification;

  queryParams = ["displayedForm"];

  @action actionButtonOnSuccess() {
    this.notification.success("Successfully submitted the form!");
  }
}
