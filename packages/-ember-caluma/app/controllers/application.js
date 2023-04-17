import Controller from "@ember/controller";
import { inject as service } from "@ember/service";

export default class ApplicationController extends Controller {
  @service router;

  get distributionIsActive() {
    return this.router.isActive(
      "demo.distribution",
      "4222ab21-9c89-47de-98be-d62a8ed0ebeb"
    );
  }
}
