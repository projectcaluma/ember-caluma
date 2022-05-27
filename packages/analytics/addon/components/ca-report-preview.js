import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { useTask } from "ember-resources";

import getAnalyticsResultsQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-results.graphql";

export default class CaReportPreviewComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked data = useTask(this, this.fetchData, () => [this.args.slug]);

  @task
  *fetchData() {
    if (this.args.slug) {
      try {
        const result = yield this.apollo.watchQuery(
          {
            query: getAnalyticsResultsQuery,
            fetchPolicy: "no-cache",
            variables: {
              slug: this.args.slug,
            },
          },
          "analyticsTable"
        );
        const headings = result.fields.edges
          .filter(({ node: { showOutput } }) => showOutput)
          .map(({ node }) => node);
        return {
          fields: result.resultData.records.edges.map(({ node }) =>
            headings.map(({ alias }) =>
              node.edges
                .map(({ node }) => node)
                .find((node) => node.alias === alias)
            )
          ),
          summary: result.resultData.summary.edges.length
            ? headings.map(({ alias: headingAlias }) =>
                result.resultData.summary.edges
                  .map(({ node }) => node)
                  .find(({ alias }) => alias === headingAlias)
              )
            : null,

          headings,
        };
      } catch (error) {
        console.error(error);
        this.notification.danger(
          this.intl.t("caluma.analytics.notification.fetch-error")
        );
      }
    }
    return null;
  }
}
