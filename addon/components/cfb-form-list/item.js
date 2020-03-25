import Component from "@ember/component";
import layout from "../../templates/components/cfb-form-list/item";

export default Component.extend({
  layout,

  tagName: "li",

  classNames: ["uk-text-nowrap", "uk-flex", "uk-flex-middle"],
});
