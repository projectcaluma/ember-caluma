import Component from "@ember/component";
import { next } from "@ember/runloop";

export default Component.extend({
  classNames: ["uk-width-auto"],

  didReceiveAttrs() {
    this._super();
    next(this.navigation, "goToNextItem");
  },
});
