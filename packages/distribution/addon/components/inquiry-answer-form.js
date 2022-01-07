import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { useTask } from "ember-resources";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import completeInquiryWorkItemMutation from "@projectcaluma/ember-distribution/gql/mutations/complete-inquiry-work-item.graphql";
import inquiryAnswerQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-answer.graphql";

export default class InquiryAnswerFormComponent extends Component {
  @service intl;
  @service router;
  @service notification;

  @config config;

  @queryManager apollo;

  _inquiry = useTask(this, this.fetchInquiryAnswer, () => [this.args.inquiry]);

  get inquiry() {
    return this._inquiry.value?.[0]?.node;
  }

  get buttons() {
    return this.inquiry?.childCase.workItems.edges.map((edge) => {
      const config = this.config.inquiry.answer.buttons[edge.node.task.slug];

      return {
        workItemId: decodeId(edge.node.id),
        color: config.color,
        isFormButton: edge.node.task.__typename === "CompleteWorkflowFormTask",
        label: this.intl.t(config.label),
      };
    });
  }

  @dropTask
  *fetchInquiryAnswer() {
    return yield this.apollo.watchQuery(
      {
        query: inquiryAnswerQuery,
        variables: {
          inquiry: this.args.inquiry,
          buttonTasks: Object.keys(this.config.inquiry.answer.buttons),
        },
      },
      "allWorkItems.edges"
    );
  }

  @dropTask
  *completeWorkItem(workItem, validate = () => true) {
    try {
      if (typeof validate === "function" && !(yield validate())) return;

      yield this.apollo.mutate({
        mutation: completeInquiryWorkItemMutation,
        variables: {
          workItem,
          statusQuestion: this.config.inquiry.answer.statusQuestion,
          buttonTasks: Object.keys(this.config.inquiry.answer.buttons),
        },
      });

      yield this.router.transitionTo("distribution.inquiry.index");
    } catch (error) {
      this.notification.danger(
        this.intl.t("caluma.distribution.answer.complete-error")
      );
    }
  }
}
