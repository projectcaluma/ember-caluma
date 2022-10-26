import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";

import config from "@projectcaluma/ember-distribution/config";
import resumeWorkItemMutation from "@projectcaluma/ember-distribution/gql/mutations/resume-work-item.graphql";
import inquiryEditQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-edit.graphql";
import inquiryQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry.graphql";

export default class CdInquiryEditFormComponent extends Component {
  @service notification;
  @service router;
  @service intl;
  @tracked inquiryId;

  @config config;

  @queryManager apollo;

  constructor(...args) {
    // setting field is necessary to have access to the inquiry id
    // in the willDestroy hook, since it doesn't seem to
    // have access to args
    super(...args);
    this.inquiryId = this.args.inquiry;
  }

  _inquiry = trackedTask(this, this.fetchInquiry, () => [this.args.inquiry]);

  get inquiry() {
    return this._inquiry.value?.[0]?.node;
  }

  @dropTask
  *fetchInquiry(inquiry) {
    return yield this.apollo.watchQuery(
      {
        query: inquiryEditQuery,
        variables: {
          inquiry,
          infoQuestion: this.config.inquiry.infoQuestion,
          deadlineQuestion: this.config.inquiry.deadlineQuestion,
        },
      },
      "allWorkItems.edges"
    );
  }

  @dropTask
  *send(validate) {
    try {
      if (!(yield validate())) return;

      yield this.apollo.mutate({
        mutation: resumeWorkItemMutation,
        variables: { workItem: this.args.inquiry },
      });

      yield this.router.transitionTo("inquiry.index");
    } catch (error) {
      this.notification.danger(
        this.intl.t("caluma.distribution.edit.send-error")
      );
    }
  }

  async willDestroy() {
    super.willDestroy();

    await this.apollo.query({
      query: inquiryQuery,
      variables: {
        inquiry: this.inquiryId,
        infoQuestion: this.config.inquiry.infoQuestion,
        deadlineQuestion: this.config.inquiry.deadlineQuestion,
      },
      fetchPolicy: "network-only",
    });
  }
}
