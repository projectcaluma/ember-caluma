import { action } from "@ember/object";
import Component from "@glimmer/component";

/**
 * Input component for the integer question type
 *
 * @class CfFieldInputIntegerComponent
 * @argument {Field} field The field for this input type
 */
export default class CfFieldInputIntegerComponent extends Component {
  /**
   * Trigger save on input
   *
   * @event input
   * @param {Event} e The input event
   * @param {Object} e.target The target of the event
   * @param {String} e.target.value The current value of the field
   */
  @action
  input({ target: { value } }) {
    const parsedValue = parseInt(value);

    this.args.onSave(!isNaN(parsedValue) ? parsedValue : null);
  }
}
