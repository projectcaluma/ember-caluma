import { action } from "@ember/object";
import Component from "@glimmer/component";

/**
 * Input component for the textarea question type
 *
 * @class CfFieldInputTextareaComponent
 * @argument {Field} field The field for this input type
 */
export default class CfFieldInputTextareaComponent extends Component {
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
    this.args.onSave(value);
  }
}
