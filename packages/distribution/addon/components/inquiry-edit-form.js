import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { useTask } from "ember-resources";

import config from "@projectcaluma/ember-distribution/config";
import resumeWorkItemMutation from "@projectcaluma/ember-distribution/gql/mutations/resume-work-item.graphql";
import inquiryEditQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-edit.graphql";

export default class InquiryEditFormComponent extends Component {
  @service notification;
  @service router;

  @config config;

  @queryManager apollo;

  _inquiry = useTask(this, this.fetchInquiry, () => [this.args.inquiry]);

  get inquiry() {
    return this._inquiry.value?.[0]?.node;
  }

  @dropTask
  *fetchInquiry() {
    return yield this.apollo.watchQuery(
      {
        query: inquiryEditQuery,
        variables: { inquiry: this.args.inquiry },
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

      yield this.router.transitionTo("distribution.inquiry.index");
    } catch (error) {
      this.notification.danger(
        this.intl.t("caluma.distribution.edit.send-error")
      );
    }
  }
}
