import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class ReportsEditRoute extends Route {
  @service intl;

  @navigationTitle
  get title() {
    return this.intl.t("caluma.analytics.list.edit");
  }

  async model({ report_id: reportId }) {
    return reportId;
  }
}
