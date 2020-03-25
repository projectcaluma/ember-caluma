import moment from "moment";
import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/date";

export default Component.extend({
  layout,
  tagName: "",

  actions: {
    onchange: function (date) {
      // Change Javascript date to ISO string if not null.
      this.onSave(date ? moment(date).format("YYYY-MM-DD") : null);
    },
  },
});
