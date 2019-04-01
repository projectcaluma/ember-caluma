import Component from "@ember/component";
import layout from "../../templates/components/cf-field/errors";

export default Component.extend({
  layout,
  tagName: "span",
  classNames: ["uk-text-small", "uk-text-danger", "validation-errors"]
});
