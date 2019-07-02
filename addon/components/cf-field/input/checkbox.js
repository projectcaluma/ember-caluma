import Component from "@ember/component";
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
     * Update the value of the field with the slugs of the currently checked
     * boxes.
     *
     * @method update
     */
    update() {
      const checkedBoxes = [
        ...this.element.querySelectorAll("input[type=checkbox]:checked")
      ];

      this.onSave([...new Set(checkedBoxes.map(el => el.value))]);
    }
  }
});
