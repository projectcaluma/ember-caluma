import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { DateTime } from "luxon";

export default class CfFieldInputDateComponent extends Component {
  @service intl;

  get locale() {
    return this.intl.primaryLocale.split("-")[0];
  }

  @action
  onChange([date]) {
    // Change Javascript date to ISO string if not null.
    this.args.onSave(date ? DateTime.fromJSDate(date).toISODate() : null);
  }

  @action
  formatDate(date) {
    return this.intl.formatDate(date, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}
