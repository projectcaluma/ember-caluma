import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { DateTime } from "luxon";

export default class CfFieldInputDateComponent extends Component {
  @service intl;

  @tracked flatpickrRef = null;

  get locale() {
    return this.intl.primaryLocale.split("-")[0];
  }

  /*
   * Extract the date format string for the current locale.
   * For example en-us will return "m/d/Y" and de-ch will return "d.m.Y".
   */
  get dateFormat() {
    const sample = this.intl.formatDate(
      DateTime.fromISO("1970-12-31").toJSDate(),
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    // refer to flatpickr documentation for formatting options
    return sample.replace(31, "d").replace(12, "m").replace(1970, "Y");
  }

  @action
  onReady(_selectedDates, _dateStr, flatpickrRef) {
    this.flatpickrRef = flatpickrRef;
  }

  @action
  clearCalendar(e) {
    e.stopPropagation();
    this.flatpickrRef.clear();
  }

  @action
  onChange([date]) {
    // Change Javascript date to ISO string if not null.
    this.args.onSave(date ? DateTime.fromJSDate(date).toISODate() : null);
  }

  // flatpickr doesnt call onChange after manual input and clicking outside.
  @action
  onClose(dates) {
    this.onChange(dates);
  }
}
