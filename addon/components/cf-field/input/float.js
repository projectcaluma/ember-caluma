import Component from "@ember/component";

/**
 * Input component for the float question type
 *
 * @class CfFieldInputFloatComponent
 * @argument {Field} field The field for this input type
 */
export default Component.extend({
  tagName: "input",
  classNames: ["uk-input"],
  classNameBindings: ["field.isInvalid:uk-form-danger"],
  attributeBindings: [
    "type",
    "step",
    "disabled",
    "field.pk:name",
    "field.answer.value:value",
    "field.question.floatMinValue:min",
    "field.question.floatMaxValue:max"
  ],
  type: "number",
  step: 0.001,

  /**
   * Trigger save on input
   *
   * @event input
   * @param {Event} e The input event
   * @param {Object} e.target The target of the event
   * @param {String} e.target.value The current value of the field
   */
  input({ target: { value } }) {
    this.onSave(value === "" || isNaN(value) ? null : parseFloat(value));
  }
});
