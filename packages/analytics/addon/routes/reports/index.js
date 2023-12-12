import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";

import getAllAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-all-analytics-tables.graphql";
import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class ReportsIndexRoute extends Route {
  @service intl;

  @queryManager apollo;

  @navigationTitle
  get title() {
    return this.intl.t("caluma.analytics.report.new");
  }

  async model() {
    const tables = await this.apollo.query(
      {
        fetchPolicy: "network-only",
        query: getAllAnalyticsTableQuery,
      },
      "allAnalyticsTables",
    );

    return tables.edges.map((edge) => edge.node);
  }
}
