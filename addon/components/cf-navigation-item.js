import Component from "@ember/component";
import { or } from "@ember/object/computed";

export default Component.extend({
  tagName: "li",
  classNames: ["cf-navigation__item", "uk-width-auto"],
  classNameBindings: ["active:uk-active"],

  active: or("item.active", "item.childrenActive"),
});
