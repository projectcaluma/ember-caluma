import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { DateTime } from "luxon";

import getConfig from "@projectcaluma/ember-core/utils/get-config";

export default class CfFieldInputDateComponent extends Component {
  @service intl;

  @tracked flatpickrRef = null;

  get locale() {
    return this.intl.primaryLocale.split("-")[0];
  }

  get dateFormat() {
    const config = getConfig(this);

    return (
      config.FLATPICKR_DATE_FORMAT[this.locale] ??
      config.FLATPICKR_DATE_FORMAT_DEFAULT
    );
  }

  @action
  onReady(_selectedDates, _dateStr, flatpickrRef) {
    this.flatpickrRef = flatpickrRef;

    // Flatpickr generates an alternative input field (altInput) that does not
    // copy over all attributes from the original input field. This fails in
    // accessibility checks when using aria attributes to account for a11y
    // compatibility.
    //
    // There's an issue (https://github.com/flatpickr/flatpickr/issues/1906)
    // about that and also an open PR
    // (https://github.com/flatpickr/flatpickr/pull/2821) to fix it. However,
    // flatpickr has not seen a new commit since 2022 and seems to be
    // deprecated.
    //
    // In order to not have to search for a new datepicker solution, we fix the
    // a11y issue ourselves by copying over all aria-* attributes to the alt
    // input.
    const { input, altInput } = flatpickrRef;

    input
      .getAttributeNames()
      .filter((attr) => attr.startsWith("aria-"))
      .filter((attr) => !altInput.hasAttribute(attr))
      .forEach((attr) => altInput.setAttribute(attr, input.getAttribute(attr)));
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
