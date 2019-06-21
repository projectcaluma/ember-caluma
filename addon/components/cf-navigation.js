import Component from "@ember/component";
import layout from "../templates/components/cf-navigation";
import { next } from "@ember/runloop";

export default Component.extend({
  layout,

  didReceiveAttrs() {
    next(this.navigation, "goToNextItem");
  }
});
