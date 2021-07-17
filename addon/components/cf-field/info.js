import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CfFieldInfoComponent extends Component {
  @tracked modalVisible = false;

  @action
  showModal(e) {
    e.preventDefault();

    this.modalVisible = true;
  }

  @action
  hideModal(e) {
    e.preventDefault();

    this.modalVisible = false;
  }
}
