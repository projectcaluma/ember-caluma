import Route from "@ember/routing/route";
import { t } from "ember-intl";

import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class DemoAnalyticsBuilderRoute extends Route {
  @navigationTitle
  @t("caluma.analytics.list.edit")
  title;

  async model({ table_slug: slug }) {
    if (!slug) {
      this.transitionTo("demo.analytics");
    }
    return slug;
  }
}
