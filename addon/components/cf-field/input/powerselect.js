import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/powerselect";
import { computed } from "@ember/object";

export default Component.extend({
  layout,
  tagName: "",

  multiple: computed("field.question.__typename", function() {
    return this.get("field.question.__typename").startsWith("Multiple");
  }),

  choices: computed(
    "field.question.{choiceOptions,multipleChoiceOptions}.edges",
    function() {
      let options =
        this.get("field.question.choiceOptions") ||
        this.get("field.question.multipleChoiceOptions");

      return options.edges.map(edge => edge.node);
    }
  ),

  componentName: computed("multiple", function() {
    let name = "power-select";

    if (this.get("multiple")) {
      name += "-multiple";
    }

    return name;
  }),

  searchEnabled: computed("multiple", "choices", function() {
    return this.get("choices").length > 3;
  }),

  actions: {
    change: function(choices) {
      this.set("field.answer.stringValue", choices);
    }
  }
});
