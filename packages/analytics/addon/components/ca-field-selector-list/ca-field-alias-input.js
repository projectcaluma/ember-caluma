import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { restartableTask, timeout } from "ember-concurrency";

export default class CaFieldSelectorListCaFieldAliasInputComponent extends Component {
  @tracked _value = null;

  get value() {
    return this._value ?? this.args.value;
  }

  get hasChanged() {
    return this._value !== null && this._value !== this.args.value;
  }

  @action
  async trimAndSave() {
    await this.args.onSave(this._value);
    this._value = null;
  }

  @restartableTask
  *debounceInput(event) {
    yield timeout(200);
    this._value = event.target.value;
  }
}
