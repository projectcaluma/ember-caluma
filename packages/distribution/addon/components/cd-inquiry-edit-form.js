import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

import config from "@projectcaluma/ember-distribution/config";
import resumeWorkItemMutation from "@projectcaluma/ember-distribution/gql/mutations/resume-work-item.graphql";
import inquiryEditQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-edit.graphql";

export default class CdInquiryEditFormComponent extends Component {
  @service distribution;
  @service notification;
  @service router;
  @service intl;

  @config config;

  @queryManager apollo;

  get inquiry() {
    return this._inquiry.value?.[0]?.node;
  }

  fetchInquiry = task({ drop: true }, async (inquiry) => {
    return await this.apollo.watchQuery(
      {
        query: inquiryEditQuery,
        variables: { inquiry },
      },
      "allWorkItems.edges",
    );
  });

  _inquiry = trackedTask(this, this.fetchInquiry, () => [this.args.inquiry]);

  send = task({ drop: true }, async (validate) => {
    try {
      if (!(await validate()) || this.distribution.sendAllInquiries.isRunning) {
        return;
      }

      await this.apollo.mutate({
        mutation: resumeWorkItemMutation,
        variables: { workItem: this.args.inquiry },
      });

      await this.router.transitionTo("inquiry.index");
    } catch {
      this.notification.danger(
        this.intl.t("caluma.distribution.edit.send-error"),
      );
    }
  });
}
