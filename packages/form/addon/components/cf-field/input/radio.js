import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class CfFieldInpuRadio extends Component {
  @action
  reset(event) {
    event.preventDefault();

    this.args.onSave(null);
  }
}
