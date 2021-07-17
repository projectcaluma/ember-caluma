import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class CfFieldInputFloatComponent extends Component {
  get disabled() {
    return this.args.disabled || this.args.field?.question.isCalculated;
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
