import Component from "@ember/component";
import moment from "moment";

import layout from "../../../templates/components/cf-field/input/date";

export default Component.extend({
  layout,
  tagName: "",

  actions: {
    onchange(date) {
      // Change Javascript date to ISO string if not null.
      this.onSave(date ? moment(date).format(moment.HTML5_FMT.DATE) : null);
    },
  },
});
