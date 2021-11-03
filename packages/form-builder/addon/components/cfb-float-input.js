import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class CfbFloatInput extends Component {
  @action
  onUpdate(event) {
    event.preventDefault();
    this.args.update(event.target.value);
    this.args.setDirty();
  }
}
