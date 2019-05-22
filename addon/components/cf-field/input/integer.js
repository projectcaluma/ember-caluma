import Component from "@ember/component";

/**
 * Input component for the integer question type
 *
 * @class CfFieldInputIntegerComponent
 * @argument {Field} field The field for this input type
 */
export default Component.extend({
  tagName: "input",
  classNames: ["uk-input", "disabled"],
  classNameBindings: ["field.isInvalid:uk-form-danger"],
  attributeBindings: [
    "type",
    "step",
    "disabled:readonly",
    "field.id:name",
    "field.answer.integerValue:value",
    "field.question.integerMinValue:min",
    "field.question.integerMaxValue:max"
  ],
  type: "number",
  step: 1,

  /**
   * Trigger save on input
   *
   * @event input
   * @param {Event} e The input event
   * @param {Object} e.target The target of the event
   * @param {String} e.target.value The current value of the field
   */
  input({ target: { value } }) {
    this.onSave(value === "" || isNaN(value) ? null : parseInt(value));
  }
});
