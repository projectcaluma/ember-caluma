import { getOwner } from "@ember/application";
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

  get config() {
    return getOwner(this).resolveRegistration("config:environment");
  }

  get dateFormat() {
    const {
      FLATPICKR_DATE_FORMAT = {},
      FLATPICKR_DATE_FORMAT_DEFAULT = "m/d/Y",
    } = this.config["ember-caluma"] || {};

    return FLATPICKR_DATE_FORMAT[this.locale] ?? FLATPICKR_DATE_FORMAT_DEFAULT;
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
