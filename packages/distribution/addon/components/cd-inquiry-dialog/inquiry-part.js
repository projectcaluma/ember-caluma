import { inject as service } from "@ember/service";
import { isEmpty } from "@ember/utils";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { confirm } from "ember-uikit";
import { DateTime } from "luxon";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import reopenInquiryMutation from "@projectcaluma/ember-distribution/gql/mutations/reopen-inquiry.graphql";
import updateInquiryMetaMutation from "@projectcaluma/ember-distribution/gql/mutations/update-inquiry-meta.graphql";
import withdrawInquiryMutation from "@projectcaluma/ember-distribution/gql/mutations/withdraw-inquiry.graphql";
import inquiryAnswerStatus from "@projectcaluma/ember-distribution/utils/inquiry-answer-status";

export default class CdInquiryDialogInquiryPartComponent extends Component {
  @service notification;
  @service router;
  @service intl;
  @service calumaOptions;
  @service abilities;

  @queryManager apollo;

  @config config;

  @inquiryAnswerStatus answerStatus;

  get status() {
    if (!this.args.type === "request" || this.args.disabled) {
      return null;
    }

    const inquiry = this.args.inquiry;

    if (inquiry.status === "SUSPENDED") {
      return this.intl.t("caluma.distribution.status.draft");
    } else if (this.abilities.can("answer inquiry", inquiry)) {
      return this.answerStatus;
    }

    return null;
  }

  get date() {
    const key = this.args.type === "request" ? "createdAt" : "closedAt";

    return this.args.inquiry[key];
  }

  get requestInfo() {
    return this.args.type === "request"
      ? this.args.inquiry.document.info.edges[0]?.node.value
      : null;
  }

  get answerInfo() {
    const questions = this.config.inquiry.answer.infoQuestions ?? [];

    return this.args.type === "answer"
      ? this.args.inquiry.childCase.document.info.edges
          .filter(
            (edge) =>
              !isEmpty(edge.node.value) ||
              !isEmpty(edge.node.selectedOption) ||
              !isEmpty(edge.node.selectedOptions),
          )
          .sort(
            (a, b) =>
              questions.indexOf(a.node.question.slug) -
              questions.indexOf(b.node.question.slug),
          )
          .map((edge) => ({
            question: edge.node.question.label,
            value: edge.node.selectedOption // single choice answer
              ? edge.node.selectedOption.label
              : edge.node.selectedOptions // multiple choice answer
                ? edge.node.selectedOptions.edges.map((edge) => edge.node.label)
                : edge.node.value, // regular answer
          }))
      : null;
  }

  @dropTask
  *withdraw(e) {
    e.preventDefault();

    /* istanbul ignore next */
    if (!(yield confirm(this.intl.t("caluma.distribution.withdraw.confirm")))) {
      return;
    }

    try {
      yield this.apollo.mutate({
        mutation: withdrawInquiryMutation,
        variables: {
          workItem: decodeId(this.args.inquiry.id),
        },
      });
    } catch (error) {
      this.notification.danger(
        this.intl.t("caluma.distribution.withdraw.error"),
      );
    }
  }

  @dropTask
  *reopen(e) {
    e.preventDefault();

    /* istanbul ignore next */
    if (
      !(yield confirm(
        this.intl.t("caluma.distribution.reopen-inquiry.confirm"),
      ))
    ) {
      return;
    }

    try {
      yield this.apollo.mutate({
        mutation: reopenInquiryMutation,
        variables: {
          workItem: decodeId(this.args.inquiry.id),
          statusQuestion: this.config.inquiry.answer.statusQuestion,
          buttonTasks: Object.keys(this.config.inquiry.answer.buttons),
        },
      });
    } catch (error) {
      this.notification.danger(
        this.intl.t("caluma.distribution.reopen-inquiry.error"),
      );
    }
  }

  @dropTask
  *sendReminder(e) {
    e.preventDefault();

    if (!(yield confirm(this.intl.t("caluma.distribution.reminder.confirm")))) {
      return;
    }

    try {
      yield this.calumaOptions.sendReminderDistributionInquiry(
        decodeId(this.args.inquiry.id),
      );

      this.notification.success(
        this.intl.t("caluma.distribution.reminder.success"),
      );

      yield this.apollo.mutate({
        mutation: updateInquiryMetaMutation,
        variables: {
          inquiry: decodeId(this.args.inquiry.id),
          meta: JSON.stringify({
            ...this.args.inquiry.meta,
            reminders: [
              DateTime.now().toISO(),
              ...(this.args.inquiry.meta.reminders ?? []),
            ],
          }),
        },
      });
    } catch (error) {
      this.notification.danger(
        this.intl.t("caluma.distribution.reminder.error"),
      );
    }
  }
}
