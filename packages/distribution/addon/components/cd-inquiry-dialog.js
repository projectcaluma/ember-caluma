import { next } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager, getObservable } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

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
    return this._inquiries.value?.allWorkItems.edges
      .map((edge) => edge.node)
      .filter(
        // suspended inquiries should only be visible to its creator
        (node) => this.currentGroupIsCreator || node.status !== "SUSPENDED",
      );
  }

  _inquiries = trackedTask(this, this.fetchDialog, () => [
    this.args.from,
    this.args.to,
    this.distribution.caseId,
    this.config,
  ]);

  @dropTask
  *fetchDialog(from, to, caseId, config) {
    const response = yield this.apollo.watchQuery({
      query: inquiryDialogQuery,
      fetchPolicy: "cache-and-network",
      variables: {
        from,
        to,
        caseId,
        task: config.inquiry.task,
        infoQuestion: config.inquiry.infoQuestion,
        deadlineQuestion: config.inquiry.deadlineQuestion,
        statusQuestion: config.inquiry.answer.statusQuestion,
        answerInfoQuestions: config.inquiry.answer.infoQuestions,
        buttonTasks: Object.keys(config.inquiry.answer.buttons),
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

    yield getObservable(this._inquiries.value).refetch();

    next(this, "transitionToLatestInquiry");
  }

  transitionToLatestInquiry() {
    this.router.transitionTo(
      "inquiry.detail.index",
      {
        from: this.args.from,
        to: this.args.to,
      },
      decodeId(this.inquiries[0].id),
    );
  }
}
