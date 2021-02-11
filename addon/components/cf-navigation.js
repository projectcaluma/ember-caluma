import Component from "@ember/component";
import { next } from "@ember/runloop";

import layout from "../templates/components/cf-navigation";

export default Component.extend({
  layout,

  classNames: ["uk-width-auto"],

  didReceiveAttrs() {
    this._super();
    next(this.navigation, "goToNextItem");
  },
});
