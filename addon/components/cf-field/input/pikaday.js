import moment from "moment";
import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/pikaday";

export default Component.extend({
  layout,

  actions: {
    onchange: function(datetime) {
      let date = moment(datetime).format("YYYY-MM-DD");
      this.onSave(date);
    }
  }
});
