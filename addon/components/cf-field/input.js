import Component from "@ember/component";
import { computed, get } from "@ember/object";
import layout from "../../templates/components/cf-field/input";

const mapping = {
  MultipleChoiceQuestion: "checkbox",
  ChoiceQuestion: "radio"
};

/**
 * Component for wrapping the input components
 *
 * @class CfFieldInputComponent
 */
export default Component.extend({
  layout,
  classNames: ["uk-form-controls"],

  /**
   * The input component type
   *
   * @property {String} type
   * @accessor
   */
  type: computed("field.question.__typename", function() {
    const typename = get(this, "field.question.__typename");

    const meta = get(this, "field.question.meta") || "{}";
    const customtype = JSON.parse(meta).widgetType;

    return (
      (customtype && customtype !== "default" && customtype) ||
      (typename && mapping[typename]) ||
      typename.replace(/Question$/, "").toLowerCase()
    );
  }).readOnly()
});
