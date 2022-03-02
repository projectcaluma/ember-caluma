import Route from "@ember/routing/route";
import { t } from "ember-intl";
import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class ReportsEditRoute extends Route {
  @navigationTitle
  @t("caluma.analytics.list.edit")
  title;

  async model({ reportId }) {
    return reportId;
  }
}
