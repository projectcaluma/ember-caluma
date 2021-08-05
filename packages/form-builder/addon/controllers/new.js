import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class NewController extends Controller {
  @action
  afterSubmit({ slug }) {
    this.transitionToRoute("edit", slug);
  }
}
