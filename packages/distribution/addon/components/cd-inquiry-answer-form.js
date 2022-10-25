import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import completeInquiryWorkItemMutation from "@projectcaluma/ember-distribution/gql/mutations/complete-inquiry-work-item.graphql";
import inquiryAnswerQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-answer.graphql";
import inquiryAnswerStatus from "@projectcaluma/ember-distribution/utils/inquiry-answer-status";

export default class CdInquiryAnswerFormComponent extends Component {
  @service intl;
  @service router;
  @service abilities;
  @service notification;
  @service calumaOptions;

  @config config;

  @queryManager apollo;

  @inquiryAnswerStatus({ inquiryProperty: "inquiry" }) answerStatus;
  @tracked isExpanded = !this.config.ui.small;

  _inquiry = trackedTask(this, this.fetchInquiryAnswer, () => [
    this.args.inquiry,
  ]);

  get inquiry() {
    return this._inquiry.value?.[0]?.node;
  }

  get inquiryDetails() {
    return this.config.inquiry.answer.details?.(this.inquiry);
  }

  get buttons() {
    return this.inquiry?.childCase.workItems.edges
      .filter((edge) => edge.node.status === "READY")
      .map((edge) => {
        const config = this.config.inquiry.answer.buttons[edge.node.task.slug];

        return this.abilities.can(
          "complete child work item of inquiry",
          this.inquiry,
          { task: edge.node.task.slug }
        )
          ? {
              workItemId: decodeId(edge.node.id),
              color: config.color,
              isFormButton:
                edge.node.task.__typename === "CompleteWorkflowFormTask",
              label: this.intl.t(config.label),
              willCompleteInquiry: config.willCompleteInquiry ?? false,
            }
          : null;
      })
      .filter(Boolean);
  }

  @action
  toggle(e) {
    e.preventDefault();
    this.isExpanded = !this.isExpanded;
  }

  @dropTask
  *fetchInquiryAnswer(inquiry) {
    return yield this.apollo.watchQuery(
      {
        query: inquiryAnswerQuery,
        variables: {
          inquiry,
          buttonTasks: Object.keys(this.config.inquiry.answer.buttons),
          infoQuestion: this.config.inquiry.infoQuestion,
          deadlineQuestion: this.config.inquiry.deadlineQuestion,
        },
      },
      "allWorkItems.edges"
    );
  }

  @dropTask
  *completeWorkItem(workItem, willCompleteInquiry, validate = () => true) {
    try {
      if (typeof validate === "function" && !(yield validate())) return;

      yield this.apollo.mutate({
        mutation: completeInquiryWorkItemMutation,
        variables: {
          workItem,
          statusQuestion: this.config.inquiry.answer.statusQuestion,
          buttonTasks: Object.keys(this.config.inquiry.answer.buttons),
          checkTask: this.config.controls.checkTask,
          createTask: this.config.controls.createTask,
          inquiryTask: this.config.inquiry.task,
          currentGroup: String(this.calumaOptions.currentGroupId),
          answerInfoQuestions: this.config.inquiry.answer.infoQuestions,
          willCompleteInquiry,
        },
      });

      yield this.router.transitionTo("inquiry.index");
    } catch (error) {
      this.notification.danger(
        this.intl.t("caluma.distribution.answer.complete-error")
      );
    }
  }
}
