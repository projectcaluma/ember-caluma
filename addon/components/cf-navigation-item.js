import Component from "@ember/component";
import { or } from "@ember/object/computed";

import layout from "../templates/components/cf-navigation-item";

export default Component.extend({
  layout,
  tagName: "li",
  classNames: ["cf-navigation__item", "uk-width-auto"],
  classNameBindings: ["active:uk-active"],

  active: or("item.active", "item.childrenActive"),
});
