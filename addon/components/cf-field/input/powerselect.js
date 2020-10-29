import { getOwner } from "@ember/application";
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

  intl: service(),

  apollo: queryManager(),

  multiple: computed("field.question.__typename", function () {
    return this.get("field.question.__typename").includes("Multiple");
  }),

  componentName: computed("multiple", function () {
    return this.multiple ? "power-select-multiple" : "power-select";
  }),

  searchEnabled: computed("field.options.length", function () {
    const { powerSelectEnableSearchLimit: limit } = getOwner(
      this
    ).resolveRegistration("config:environment")["ember-caluma"];
    return this.get("field.options.length") > limit;
  }),

  placeholder: computed("multiple", function () {
    const suffix = this.multiple ? "multiple" : "single";
    const path = `caluma.form.power-select.placeholder-${suffix}`;
    return this.intl.t(path);
  }),

  actions: {
    change(choices) {
      let value = null;

      if (Array.isArray(choices)) {
        value = choices.map((choice) => choice.slug);
      } else if (choices !== null) {
        value = choices.slug;
      }
      // ELSE will never be taken as long as we don't allow for empty
      // selections in single choice fields. Empty selections must first be
      // implemented/allowed by the backend.

      this.onSave(value);
    },
  },
});
