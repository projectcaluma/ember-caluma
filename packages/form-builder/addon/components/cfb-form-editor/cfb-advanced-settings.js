import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
export default class CfbFormEditorCfbAdvancedSettings extends Component {
  @tracked showAdvanced = false;

  constructor(owner, args) {
    super(owner, args);

    this.showAdvanced =
      JSON.parse(localStorage.getItem("showAdvanced")) ?? false;
  }

  @action
  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;

    localStorage.setItem("showAdvanced", this.showAdvanced);
  }
}
