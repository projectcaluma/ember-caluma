import Component from "@ember/component";
import layout from "../templates/components/cf-navigation-item";
import { inject as service } from "@ember/service";

export default Component.extend({
  layout,
  router: service(),
  tagName: "li",
  classNames: ["cf-navigation__item"],
  classNameBindings: ["treeItem.item.active:uk-active"]
});
