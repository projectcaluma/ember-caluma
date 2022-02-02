import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { DateTime, Info } from "luxon";
import { cached } from "tracked-toolbox";

export default class CfFieldInputDateComponent extends Component {
  @service intl;

  @action
  onChange(date) {
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

  @cached
  get pikadayTranslations() {
    const locale = this.intl.primaryLocale;

    return {
      previousMonth: this.intl.t("caluma.form.pikaday.month-previous"),
      nextMonth: this.intl.t("caluma.form.pikaday.month-next"),
      months: Info.months("long", { locale }),
      weekdays: Info.weekdays("long", { locale }),
      weekdaysShort: Info.weekdays("short", { locale }),
    };
  }
}
