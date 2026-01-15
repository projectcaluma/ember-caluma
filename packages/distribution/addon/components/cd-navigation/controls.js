import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
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

  completeDistribution = task({ drop: true }, async () => {
    try {
      let confirmText = this.intl.t("caluma.distribution.skip-confirm");

      if (this.distribution.hasInquiries) {
        const incompleteInquiries = await this.apollo.query(
          {
            query: incompleteInquiriesQuery,
            variables: {
              caseId: this.distribution.caseId,
              task: this.config.inquiry.task,
            },
          },
          "allWorkItems.totalCount",
        );

        confirmText =
          incompleteInquiries === 0
            ? this.intl.t("caluma.distribution.complete-confirm-empty")
            : this.intl.t("caluma.distribution.complete-confirm", {
                count: incompleteInquiries,
              });
      }

      if (!(await confirm(confirmText))) {
        return;
      }

      const completeDistributionWorkItem =
        this.distribution.controls.value.complete.edges?.[0]?.node.id;

      await this.apollo.mutate({
        mutation: completeWorkItemMutation,
        variables: {
          workItem: completeDistributionWorkItem,
        },
      });

      await this.config.hooks.postCompleteDistribution?.();

      await this.distribution.refetch();
      this.router.transitionTo("index");
    } catch {
      this.notification.danger(
        this.intl.t("caluma.distribution.complete-error"),
      );
    }
  });

  reopenDistribution = task({ drop: true }, async () => {
    try {
      if (!(await confirm(this.intl.t("caluma.distribution.reopen-confirm")))) {
        return;
      }

      const distributionWorkItemId = decodeId(
        this.distribution.controls.value?.case.edges[0]?.node.parentWorkItem.id,
      );

      await this.apollo.mutate({
        mutation: reopenDistributionMutation,
        variables: {
          workItem: distributionWorkItemId,
        },
      });

      await this.distribution.refetchControls();
    } catch {
      this.notification.danger(this.intl.t("caluma.distribution.reopen-error"));
    }
  });

  checkInquiries = task({ drop: true }, async () => {
    try {
      await this.apollo.mutate({
        mutation: completeWorkItemMutation,
        variables: {
          workItem: decodeId(
            this.distribution.controls.value?.check.edges[0]?.node.id,
          ),
        },
      });
    } catch {
      this.notification.danger(
        this.intl.t("caluma.distribution.check-inquiries-error"),
      );
    }
  });
}
