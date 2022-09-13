import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager, getObservable } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import inquiryDialogQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-dialog.graphql";

export default class CdInquiryDialogComponent extends Component {
  @service intl;
  @service router;
  @service distribution;
  @service notification;
  @service calumaOptions;

  @config config;

  @queryManager apollo;

  get currentGroupIsCreator() {
    return String(this.calumaOptions.currentGroupId) === this.args.from;
  }

  get inquiries() {
    return this._inquiries.value?.allWorkItems.edges.map((edge) => edge.node);
  }

  _inquiries = trackedTask(this, this.fetchDialog, () => [
    this.args.from,
    this.args.to,
    this.args.caseId,
    this.config,
  ]);

  @dropTask
  *fetchDialog() {
    const response = yield this.apollo.watchQuery({
      query: inquiryDialogQuery,
      variables: {
        from: this.args.from,
        to: this.args.to,
        caseId: this.args.caseId,
        task: this.config.inquiry.task,
        infoQuestion: this.config.inquiry.infoQuestion,
        deadlineQuestion: this.config.inquiry.deadlineQuestion,
        statusQuestion: this.config.inquiry.answer.statusQuestion,
        answerInfoQuestions: this.config.inquiry.answer.infoQuestions,
        buttonTasks: Object.keys(this.config.inquiry.answer.buttons),
        includeNavigationData: true,
      },
    });

    /**
     * Sadly this is necessary to handle what happens after the withdraw task in
     * the inquiry part component because the mutation triggers a refresh of the
     * query above in the same runloop instead of the next one.  This causes
     * `this.inquiries` to be recomputed which then triggers a rerender of the
     * component and therefore cancels the withdraw task before we can do a
     * transition.
     *
     * TODO: If https://github.com/ember-graphql/ember-apollo-client/pull/421 is
     * merged and released, we can rewrite this into an action that is triggered
     * in the withdraw task of the child component.
     */
    getObservable(response).subscribe(({ data: { allWorkItems } }) => {
      if (allWorkItems.edges.every((edge) => edge.node.status === "CANCELED")) {
        this.router.transitionTo("index");
      }
    });

    return response;
  }

  @dropTask
  *createInquiry(e) {
    e.preventDefault();

    yield this.distribution.createInquiry.perform([this.args.to]);

    // refetch dialog data
    yield getObservable(this._inquiries.value).refetch();

    this.router.transitionTo(
      "inquiry.detail.index",
      {
        from: this.args.from,
        to: this.args.to,
      },
      decodeId(this.inquiries[0].id)
    );
  }
}
