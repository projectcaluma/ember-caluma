import getAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-table.graphql";

export default function* getAnalyticsTable(slug) {
  try {
    return yield this.apollo.watchQuery(
      {
        query: getAnalyticsTableQuery,
        fetchPolicy: "cache-and-network",
        variables: { slug },
      },
      "analyticsTable",
    );
  } catch (error) {
    console.error(error);
    this.notification.danger(
      this.intl.t("caluma.notification.table-not-found"),
    );
  }
}
