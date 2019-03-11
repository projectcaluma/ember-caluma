import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import layout from "../../../templates/components/cf-field/input/powerselect";

/**
 * Dropdown component for the single and multiple choice question type
 *
 * @class CfFieldInputPowerSelectComponent
 * @argument {Field} field The field for this input type
 */
export default Component.extend({
  layout,
  tagName: "",
  intl: service(),

  multiple: computed("field.question.__typename", function() {
    return this.get("field.question.__typename").startsWith("Multiple");
  }),

  choices: computed(
    "multiple",
    "field.question.{choiceOptions,multipleChoiceOptions}.edges",
    function() {
      const options = this.get("multiple")
        ? this.get("field.question.multipleChoiceOptions")
        : this.get("field.question.choiceOptions");

      return options.edges.map(edge => edge.node);
    }
  ),

  selected: computed(
    "field.answer.{_valueKey,listValue,stringValue}",
    function() {
      const key = this.get("field.answer._valueKey");
      const answers = this.get(`field.answer.${key}`);

      if (!answers) {
        return null;
      }

      const selection = this.get("choices").filter(choice => {
        return answers.includes(choice.slug);
      });

      return key === "stringValue" ? selection[0] : selection;
    }
  ),

  componentName: computed("multiple", function() {
    return this.get("multiple") ? "power-select-multiple" : "power-select";
  }),

  searchEnabled: computed("choices", function() {
    return this.get("choices").length > 10;
  }),

  placeholder: computed("multiple", function() {
    const suffix = this.get("multiple") ? "multiple" : "single";
    const path = `caluma.form.power-select.placeholder-${suffix}`;
    return this.get("intl").t(path);
  }),

  actions: {
    change: function(choices) {
      let value = null;

      if (Array.isArray(choices)) {
        value = choices.map(choice => choice.slug);
      } else if (choices !== null) {
        value = choices.slug;
      }
      // ELSE will never be taken as long as we don't allow for empty
      // selections in single choice fields. Empty selections must first be
      // implemented/allowed by the backend.

      this.onSave(value);
    }
  }
});
