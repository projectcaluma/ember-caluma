import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { confirm } from "ember-uikit";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import withdrawInquiryMutation from "@projectcaluma/ember-distribution/gql/mutations/withdraw-inquiry.graphql";

export default class InquiryDialogInquiryPartComponent extends Component {
  @service notification;
  @service router;
  @service intl;

  @queryManager apollo;

  @config config;

  get date() {
    const key = this.args.type === "request" ? "createdAt" : "closedAt";

    return this.args.inquiry[key];
  }

  get info() {
    const document =
      this.args.type === "request"
        ? this.args.inquiry.document
        : this.args.type === "answer"
        ? this.args.inquiry.childCase.document
        : null;

    return document.info.edges[0]?.node.value;
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
        this.intl.t("caluma.distribution.withdraw.error")
      );
    }
  }
}
