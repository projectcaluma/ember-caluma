import EmberObject from "@ember/object";
import moment from "moment";

export default {
  name: "setup-pikaday-i18n",
  initialize: function(application) {
    const intl = application.lookup("service:intl");

    moment.locale(intl.locale);

    const i18n = EmberObject.extend({
      previousMonth: intl.t("caluma.form.pikaday.month-previous"),
      nextMonth: intl.t("caluma.form.pikaday.month-next"),
      months: moment.localeData()._months,
      weekdays: moment.localeData()._weekdays,
      weekdaysShort: moment.localeData()._weekdaysShort
    });

    application.register("pikaday-i18n:main", i18n, { singleton: true });
    application.inject("component:pikaday-input", "i18n", "pikaday-i18n:main");
  }
};
