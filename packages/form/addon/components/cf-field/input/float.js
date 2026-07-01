import { action } from "@ember/object";
import Component from "@glimmer/component";

import getConfig from "@projectcaluma/ember-core/utils/get-config";

export default class CfFieldInputFloatComponent extends Component {
  get disabled() {
    return this.args.disabled || this.args.field?.question.isCalculated;
  }

  get floatStep() {
    if (this.args.field?.question?.raw?.floatStep) {
      return this.args.field.question.raw.floatStep;
    }

    return getConfig(this).floatStep;
  }

  /**
   * Trigger save on input
   *
   * @method onInput
   * @param {Event} e The input event
   * @param {Object} e.target The target of the event
   * @param {String} e.target.value The current value of the field
   */
  @action input({ target: { value } }) {
    const parsedValue = parseFloat(value);

    this.args.onSave(!isNaN(parsedValue) ? parsedValue : null);
  }
}
