import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class CfbJexlBooleanToggleSwitch extends Component {
  get boolValue() {
    return this.args.value === "true";
  }

  @action
  toggle(boolValue) {
    this.args.update(String(boolValue));
  }
}
