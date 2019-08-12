import Component from "@ember/component";
import layout from "../templates/components/cf-navigation";
import { next } from "@ember/runloop";

export default Component.extend({
  layout,

  classNames: ["uk-width-auto"],

  didReceiveAttrs() {
    next(this.navigation, "goToNextItem");
  }
});
