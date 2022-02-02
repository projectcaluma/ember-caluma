import { action } from "@ember/object";
import Component from "@glimmer/component";
import moment from "moment";

export default class CfFieldInputDateComponent extends Component {
  @action
  onChange(date) {
    // Change Javascript date to ISO string if not null.
    this.args.onSave(date ? moment(date).format(moment.HTML5_FMT.DATE) : null);
  }
}
