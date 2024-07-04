import { action } from "@ember/object";
import { next } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";
import * as XLSX from "xlsx";

import getAnalyticsResultsQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-results.graphql";

export default class CaReportPreviewComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;

  @tracked data = trackedTask(this, this.fetchData, () => [this.args.slug]);

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
          "analyticsTable",
        );
        const headings = result.fields.edges
          .filter(({ node: { showOutput } }) => showOutput)
          .map(({ node }) => node);
        return {
          fields: result.resultData.records.edges.map(({ node }) =>
            headings.map(({ alias }) =>
              node.edges
                .map(({ node }) => node)
                .find((node) => node.alias === alias),
            ),
          ),
          summary: result.resultData.summary.edges.length
            ? headings.map(({ alias: headingAlias }) =>
                result.resultData.summary.edges
                  .map(({ node }) => node)
                  .find(({ alias }) => alias === headingAlias),
              )
            : null,

          headings,
        };
      } catch (error) {
        console.error(error);
        this.notification.danger(
          this.intl.t("caluma.analytics.notification.fetch-error"),
        );
      }
    }
    return null;
  }

  @action
  exportTable() {
    next(() => {
      const wb = XLSX.utils.table_to_book(
        document.getElementById("reports-table"),
      );
      XLSX.writeFile(
        wb,
        `${new Date().toLocaleDateString()}_${this.args.slug}.xlsx`,
      );
    });
  }

  getXLSXType(input) {
    // Check if it's a number
    if (!isNaN(input) && input.trim() !== "") {
      return "n";
    }

    // Check if it looks like a date and can be parsed as a date
    if (/^\d{4}-\d{2}-\d{2}$/.test(input) && !isNaN(Date.parse(input))) {
      return "d";
    }

    // Default to string
    return "s";
  }
}
