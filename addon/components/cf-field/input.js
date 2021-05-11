import Component from "@ember/component";
import { computed, get } from "@ember/object";

const mapping = {
  MultipleChoiceQuestion: "checkbox",
  ChoiceQuestion: "radio",
  DynamicMultipleChoiceQuestion: "checkbox",
  DynamicChoiceQuestion: "radio",
  CalculatedFloatQuestion: "float",
};

/**
 * Component for wrapping the input components
 *
 * @class CfFieldInputComponent
 */
export default Component.extend({
  classNames: ["uk-form-controls"],

  /**
   * The input component type
   *
   * @property {String} type
   * @accessor
   */
  type: computed("field.question.__typename", function () {
    const typename = get(this, "field.question.__typename");

    return (
      typename &&
      (mapping[typename] || typename.replace(/Question$/, "").toLowerCase())
    );
  }).readOnly(),
});
