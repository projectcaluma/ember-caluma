import { action } from "@ember/object";
import Component from "@glimmer/component";
import moment from "moment";

export default class extends Component {
  @action
  onChange(date) {
    // Change Javascript date to ISO string if not null.
    this.args.onSave(
      date
        ? moment({
            day: date.getUTCDate(),
            month: date.getUTCMonth(),
            year: date.getUTCFullYear(),
          }).format(moment.HTML5_FMT.DATE)
        : null
    );
  }
}
