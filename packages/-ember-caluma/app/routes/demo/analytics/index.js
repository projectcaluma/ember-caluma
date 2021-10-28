import Route from "@ember/routing/route";
import { queryManager } from "ember-apollo-client";
import { t } from "ember-intl";

import getAllAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-all-analytics-tables.graphql";
import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class DemoAnalyticsRoute extends Route {
  @queryManager apollo;

  @navigationTitle
  @t("caluma.analytics.list.new")
  title;

  async model() {
    const tables = await this.apollo.query(
      {
        fetchPolicy: "network-only",
        query: getAllAnalyticsTableQuery,
      },
      "allAnalyticsTables"
    );

    return tables.edges.map((edge) => edge.node);
  }
}
