import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
// import { computed } from "@ember/object";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency-decorators";

import getAnalyticsResultsQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-results.graphql";

export default class CaReportPreviewComponent extends Component {
  @queryManager apollo;
  @service notification;

  @tracked _resultData;

  // @computed("resultdata.records")
  get resultData() {
    if (!this._resultData) return [];
    //TODO: unpack result records
    return [];
  }

  @dropTask
  *fetchData() {
    if (this.args.slug) {
      try {
        this._resultData = yield this.apollo.query(
          {
            query: getAnalyticsResultsQuery,
            fetchPolicy: "network-only",
            variables: {
              slug: this.args.slug,
            },
          },
          "analyticsTable.ResultData"
        );
      } catch (e) {
        this.notification.danger(e);
      }
    }
  }

  download() {
    // TODO: when download query is available
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
