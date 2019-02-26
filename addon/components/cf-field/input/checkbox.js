import Component from "@ember/component";
import { get } from "@ember/object";
import layout from "../../../templates/components/cf-field/input/checkbox";

/**
 * Input component for the checkbox question type
 *
 * @class CfFieldInputCheckboxComponent
 * @argument {Field} field The field for this input type
 */
export default Component.extend({
  layout,
  tagName: "",

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
