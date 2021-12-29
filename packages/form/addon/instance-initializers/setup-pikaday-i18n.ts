import ApplicationInstance from "@ember/application/instance";
import { inject as service } from "@ember/service";
import IntlService from "ember-intl/services/intl";
import moment from "moment";

class Translations {
  @service declare intl: IntlService;

  get previousMonth(): string {
    return this.intl.t("caluma.form.pikaday.month-previous");
  }

  get nextMonth(): string {
    return this.intl.t("caluma.form.pikaday.month-next");
  }

  months: string[] = moment.localeData().months();
  weekdays: string[] = moment.localeData().weekdays();
  weekdaysShort: string[] = moment.localeData().weekdaysShort();
}

export function initialize(applicationInstance: ApplicationInstance) {
  applicationInstance.register("pikaday-i18n:main", Translations, {
    singleton: true,
  });
  applicationInstance.inject(
    "component:pikaday-input",
    "i18n",
    "pikaday-i18n:main"
  );
}

export default {
  name: "setup-pikaday-i18n",
  initialize,
};
