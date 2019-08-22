import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import layout from "../../../templates/components/cf-field/input/powerselect";
import { queryManager } from "ember-apollo-client";

/**
 * Dropdown component for the single and multiple choice question type
 *
 * @class CfFieldInputPowerSelectComponent
 * @argument {Field} field The field for this input type
 */
export default Component.extend({
  layout,

  tagName: "",

  apollo: queryManager(),

  intl: service(),

  multiple: computed("field.question.__typename", function() {
    return this.get("field.question.__typename").includes("Multiple");
  }),

  choices: computed(
    "multiple",
    "field.question.{choiceOptions,multipleChoiceOptions,dynamicChoiceOptions,dynamicMultipleChoiceOptions}.edges",
    function() {
      let options;
      if (
        this.get("field.question.__typename").includes("Dynamic") &&
        this.multiple
      ) {
        options = this.get("field.question.dynamicMultipleChoiceOptions");
      } else if (this.get("field.question.__typename").includes("Dynamic")) {
        options = this.get("field.question.dynamicChoiceOptions");
      } else if (this.multiple) {
        options = this.get("field.question.multipleChoiceOptions");
      } else {
        options = this.get("field.question.choiceOptions");
      }

      return options.edges.map(edge => edge.node);
    }
  ),

  selected: computed("field.answer.value", function() {
    const answer = this.get("field.answer.value");
    const isSingleChoice = !Array.isArray(answer);

    if (!answer) {
      return null;
    }

    const selection = this.choices.filter(choice => {
      return isSingleChoice
        ? answer === choice.slug
        : answer.includes(choice.slug);
    });

    return isSingleChoice ? selection[0] : selection;
  }),

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
