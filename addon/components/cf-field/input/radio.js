import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/radio";
import { computed } from "@ember/object";

/**
 * Input component for the radio question type
 *
 * @class CfFieldInputRadioComponent
 * @argument {Field} field The field for this input type
 */
export default Component.extend({
  layout,
  tagName: "",

  choices: computed(
    "field.question.{choiceOptions,dynamicChoiceOptions}.edges",
    function() {
      const options = this.get("field.question.__typename").includes("Dynamic")
        ? this.get("field.question.dynamicChoiceOptions.edges")
        : this.get("field.question.choiceOptions.edges");

      return options.filter(option => !option.node.isArchived);
    }
  )
});
