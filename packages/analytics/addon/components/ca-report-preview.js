import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
// import { computed } from "@ember/object";
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
            fetchPolicy: "cache-and-network",
            variables: {
              slug: this.args.slug,
            },
          },
          "analyticsTable"
        );
        const headings = result.fields.edges.map(({ node }) => node);
        return {
          fields: result.resultData.records.edges.map(({ node }) =>
            headings.map(({ alias }) =>
              node.edges
                .map(({ node }) => node)
                .find((node) => node.alias === alias)
            )
          ),
          headings,
        };
      } catch (error) {
        console.error(error);
        this.notification.danger(this.intl.t("caluma.analytics.error_preview"));
      }
    }
    return null;
  }

  download() {
    alert("TODO");
    // TODO: when download query is available
    //
    // const { downloadUrl } = await this.apollo.watchQuery(
    //   {
    //     query: getFileAnswerInfoQuery,
    //     variables: { id: this.args.field.answer.id },
    //     fetchPolicy: "cache-and-network",
    //   },
    //   "node.fileValue"
    // );
    // if (downloadUrl) {
    //   window.open(downloadUrl, "_blank");
    // }
  }
}
