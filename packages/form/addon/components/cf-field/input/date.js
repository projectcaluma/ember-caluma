import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { DateTime, Info } from "luxon";
import { cached } from "tracked-toolbox";

// put the last element to the front of the array
const shift = (array) => [...array.slice(-1), ...array.slice(0, -1)];

export default class CfFieldInputDateComponent extends Component {
  @service intl;

  @action
  onChange(date) {
    // Change Javascript date to ISO string if not null.
    this.args.onSave(date ? DateTime.fromJSDate(date).toISODate() : null);
  }

  @action
  parseDate(value) {
    const date = DateTime.fromFormat(value, "D", {
      locale: this.intl.primaryLocale,
    });

    return date.isValid ? date.toJSDate() : null;
  }

  @action
  formatDate(date) {
    return this.intl.formatDate(date, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  @cached
  get pikadayTranslations() {
    const locale = this.intl.primaryLocale;

    return {
      previousMonth: this.intl.t("caluma.form.pikaday.month-previous"),
      nextMonth: this.intl.t("caluma.form.pikaday.month-next"),
      months: Info.months("long", { locale }),
      weekdays: shift(Info.weekdays("long", { locale })),
      weekdaysShort: shift(Info.weekdays("short", { locale })),
    };
  }
}
