import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { confirm } from "ember-uikit";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import completeWorkItemMutation from "@projectcaluma/ember-distribution/gql/mutations/complete-work-item.graphql";
import reopenDistributionMutation from "@projectcaluma/ember-distribution/gql/mutations/reopen-distribution.graphql";
import incompleteInquiriesQuery from "@projectcaluma/ember-distribution/gql/queries/incomplete-inquiries.graphql";

export default class CdNavigationControlsComponent extends Component {
  @service distribution;
  @service intl;
  @service notification;
  @service router;

  @queryManager apollo;
  @config config;

  @dropTask
  *completeDistribution() {
    try {
      let confirmText = this.intl.t("caluma.distribution.skip-confirm");

      if (this.distribution.hasInquiries) {
        const incompleteInquiries = yield this.apollo.query(
          {
            query: incompleteInquiriesQuery,
            variables: {
              caseId: this.distribution.caseId,
              task: this.config.inquiry.task,
            },
          },
          "allWorkItems.totalCount"
        );

        confirmText =
          incompleteInquiries === 0
            ? this.intl.t("caluma.distribution.complete-confirm-empty")
            : this.intl.t("caluma.distribution.complete-confirm", {
                count: incompleteInquiries,
              });
      }

      if (!(yield confirm(confirmText))) {
        return;
      }

      const completeDistributionWorkItem =
        this.distribution.controls.value.complete.edges?.[0]?.node.id;

      yield this.apollo.mutate({
        mutation: completeWorkItemMutation,
        variables: {
          workItem: completeDistributionWorkItem,
        },
      });

      yield this.config.hooks.postCompleteDistribution?.();

      yield this.distribution.refetch();
      this.router.transitionTo("index");
    } catch (e) {
      this.notification.danger(
        this.intl.t("caluma.distribution.complete-error")
      );
    }
  }

  @dropTask
  *reopenDistribution() {
    try {
      if (!(yield confirm(this.intl.t("caluma.distribution.reopen-confirm")))) {
        return;
      }

      const distributionWorkItemId = decodeId(
        this.distribution.controls.value?.case.edges[0]?.node.parentWorkItem.id
      );

      yield this.apollo.mutate({
        mutation: reopenDistributionMutation,
        variables: {
          workItem: distributionWorkItemId,
        },
      });

      yield this.distribution.refetchControls();
    } catch (e) {
      this.notification.danger(this.intl.t("caluma.distribution.reopen-error"));
    }
  }

  @dropTask
  *checkInquiries() {
    try {
      yield this.apollo.mutate({
        mutation: completeWorkItemMutation,
        variables: {
          workItem: decodeId(
            this.distribution.controls.value?.check.edges[0]?.node.id
          ),
        },
      });
    } catch (e) {
      this.notification.danger(
        this.intl.t("caluma.distribution.check-inquiries-error")
      );
    }
  }
}
