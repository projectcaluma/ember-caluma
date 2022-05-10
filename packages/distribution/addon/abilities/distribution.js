import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

import config from "@projectcaluma/ember-distribution/config";

const hasStatus = (status) => (edge) => edge.node.status === status;

export default class DistributionAbility extends Ability {
  @service distribution;

  @config config;

  get canSendInquiries() {
    return (
      !this.config.ui.readonly &&
      (this.config.permissions.sendInquiry?.(null) ?? true) &&
      this.distribution.controls.value?.send.edges.filter(
        hasStatus("SUSPENDED")
      ).length > 0
    );
  }

  get canCreateInquiry() {
    return (
      !this.config.ui.readonly &&
      (this.config.permissions.createInquiry?.() ?? true) &&
      this.distribution.controls.value?.create.edges.filter(hasStatus("READY"))
        .length > 0
    );
  }

  get canComplete() {
    return (
      !this.config.ui.readonly &&
      (this.config.permissions.completeDistribution?.() ?? true) &&
      this.distribution.controls.value?.complete.edges.filter(
        hasStatus("READY")
      ).length > 0
    );
  }
}
