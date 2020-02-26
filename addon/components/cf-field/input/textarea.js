import Component from "@ember/component";

/**
 * Input component for the textarea question type
 *
 * @class CfFieldInputTextareaComponent
 * @argument {Field} field The field for this input type
 */
export default Component.extend({
  tagName: "textarea",
  classNames: ["uk-textarea"],
  classNameBindings: ["field.isInvalid:uk-form-danger", "disabled:uk-disabled"],
  attributeBindings: [
    "disabled:readonly",
    "field.pk:name",
    "field.pk:id",
    "field.answer.value:value",
    "field.question.textareaMaxLength:maxlength"
  ],

  /**
   * Trigger save on input
   *
   * @event input
   * @param {Event} e The input event
   * @param {Object} e.target The target of the event
   * @param {String} e.target.value The current value of the field
   */
  input({ target: { value } }) {
    this.onSave(value);
  }
});
