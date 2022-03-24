import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { confirm } from "ember-uikit";
import { gql } from "graphql-tag";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";

export default class CdNavigationControlsComponent extends Component {
  @service distribution;
  @service intl;

  @queryManager apollo;

  @action
  noop(e) {
    e.preventDefault();
  }

  @dropTask
  *sendInquiries() {
    if (!(yield confirm(this.intl.t("caluma.distribution.send-confirm")))) {
      return;
    }

    try {
      const ids = this.distribution.controls.value.send.edges.map((edge) =>
        decodeId(edge.node.id)
      );

      const mutations = ids.map(
        (id, index) => `
        sendInquiry${index}: resumeWorkItem(input: { id: "${id}" }) {
          workItem {
            id
            status
          }
        }
      `
      );

      const mutation = gql`mutation SendInquiries {${mutations.join("\n")}}`;

      yield this.apollo.mutate({ mutation });
    } catch (e) {
      this.notification.danger(this.intl.t("caluma.distribution.send-error"));
    }
  }
}
