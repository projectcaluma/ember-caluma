import Component from "@ember/component";
import { get } from "@ember/object";
import layout from "../../../templates/components/cf-field/input/checkbox";
import { computed } from "@ember/object";

/**
 * Input component for the checkbox question type
 *
 * @class CfFieldInputCheckboxComponent
 * @argument {Field} field The field for this input type
 */
export default Component.extend({
  layout,
  tagName: "",

  choices: computed(
    "field.question.{multipleChoiceOptions,dynamicMultipleChoiceOptions}.edges",
    function() {
      if (this.get("field.question.__typename").includes("Dynamic")) {
        return this.get("field.question.dynamicMultipleChoiceOptions.edges");
      }
      return this.get("field.question.multipleChoiceOptions.edges");
    }
  ),

  actions: {
    /**
     * Toggle the checked state of an option and trigger saving the field.
     *
     * @method toggle
     * @param {String} slug The slug of the changed option
     * @param {Boolean} checked Whether the options checkbox is checked or not
     */
    toggle(slug, checked) {
      const value = get(this, "field.answer.listValue") || [];

      this.onSave([
        ...new Set([...value, slug].filter(v => v !== slug || checked))
      ]);
    }
  }
});
