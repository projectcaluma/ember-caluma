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
      let options = this.get("multiple")
        ? this.get("field.question.multipleChoiceOptions")
        : this.get("field.question.choiceOptions");

      return options.edges.map(edge => edge.node);
    }
  ),

  selected: computed(
    "field.answer.{_valueKey,listValue,stringValue}",
    function() {
      let key = this.get("field.answer._valueKey");
      let path = `field.answer.${key}`;
      let answers = this.get(path);
      let selection = null;

      if (answers !== null) {
        selection = this.get("choices").filter(choice => {
          return answers.includes(choice.slug);
        });

        if (key === "stringValue") {
          selection = selection[0];
        }
      }

      return selection;
    }
  ),

  componentName: computed("multiple", function() {
    let name = "power-select";

    if (this.get("multiple")) {
      name += "-multiple";
    }

    return name;
  }),

  searchEnabled: computed("choices", function() {
    return this.get("choices").length > 10;
  }),

  placeholder: computed("multiple", function() {
    let suffix = this.get("multiple") ? "multiple" : "single";
    let path = `caluma.form.power-select.placeholder-${suffix}`;
    return this.get("intl").t(path);
  }),

  actions: {
    change: function(choices) {
      let key = this.get("field.answer._valueKey");
      let value = null;

      if (key === "listValue") {
        value = choices.map(choice => choice.slug);
      } else if (choices !== null) {
        value = choices.slug;
      }

      this.onSave(value);
    }
  }
});
