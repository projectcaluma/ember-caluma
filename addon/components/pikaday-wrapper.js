import { inject as service } from "@ember/service";
import PikadayInput from "ember-pikaday/components/pikaday-input";
import moment from "moment";

export default PikadayInput.extend({
  intl: service(),

  init(...args) {
    this._super(...args);

    moment.locale(this.intl.locale);

    this.i18n = {
      previousMonth: this.intl.t("caluma.form.pikaday.month-previous"),
      nextMonth: this.intl.t("caluma.form.pikaday.month-next"),
      months: moment.localeData()._months,
      weekdays: moment.localeData()._weekdays,
      weekdaysShort: moment.localeData()._weekdaysMin,
    };
  },
});
