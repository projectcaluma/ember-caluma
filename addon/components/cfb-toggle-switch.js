import Component from "@ember/component";

import layout from "../templates/components/cfb-toggle-switch";

export default Component.extend({
  layout,

  actions: {
    toggle(value) {
      this.update(value);
    },
  },
});
