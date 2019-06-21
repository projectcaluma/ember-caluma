import Component from "@ember/component";
import layout from "../templates/components/cf-navigation-item";

export default Component.extend({
  layout,
  tagName: "li",
  classNames: ["cf-navigation__item"],
  classNameBindings: ["item.active:uk-active"]
});
