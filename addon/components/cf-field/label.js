import Component from "@ember/component";
import layout from "../../templates/components/cf-field/label";

export default Component.extend({
  layout,
  tagName: "label",
  classNames: ["uk-form-label"],
  attributeBindings: ["field.pk:for"]
});
