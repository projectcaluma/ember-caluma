import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { useTask } from "ember-resources";

import config from "@projectcaluma/ember-distribution/config";
import inquiryDialogQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-dialog.graphql";

export default class InquiryDialogComponent extends Component {
  @config config;

  @queryManager apollo;

  get inquiries() {
    return this._inquiries.value?.allWorkItems.edges.map((edge) => edge.node);
  }

  _inquiries = useTask(this, this.fetchDialog, () => [
    this.args.from,
    this.args.to,
    this.args.caseId,
    this.config,
  ]);

  @dropTask
  *fetchDialog() {
    return yield this.apollo.watchQuery({
      query: inquiryDialogQuery,
      variables: {
        from: this.args.from,
        to: this.args.to,
        caseId: this.args.caseId,
        task: this.config.inquiry.task,
        infoQuestion: this.config.inquiry.infoQuestion,
        deadlineQuestion: this.config.inquiry.deadlineQuestion,
        statusQuestion: this.config.inquiry.answer.statusQuestion,
        answerInfoQuestion: this.config.inquiry.answer.infoQuestion,
        includeNavigationData: true,
      },
    });
  }
}
