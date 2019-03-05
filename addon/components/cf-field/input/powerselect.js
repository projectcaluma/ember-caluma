import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/powerselect";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

export default Component.extend({
  layout,
  tagName: "",
  intl: service(),

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

  placeholder: computed("multiple", function() {
    let suffix = this.get("multiple") ? "multiple" : "single";
    let path = `caluma.form.power-select.placeholder-${suffix}`;
    return this.get("intl").t(path);
  }),

  actions: {
    change: function(choices) {
      this.set("field.answer.stringValue", choices);
    }
  }
});
