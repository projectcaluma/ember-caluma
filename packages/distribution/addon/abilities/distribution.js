import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

const hasStatus = (status) => (edge) => edge.node.status === status;

export default class DistributionAbility extends Ability {
  @service distribution;

  get canSendInquiries() {
    return (
      this.distribution.controls.value?.send.edges.filter(
        hasStatus("SUSPENDED")
      ).length > 0
    );
  }

  get canCreateInquiry() {
    return (
      this.distribution.controls.value?.create.edges.filter(hasStatus("READY"))
        .length > 0
    );
  }

  get canComplete() {
    return (
      this.distribution.controls.value?.complete.edges.filter(
        hasStatus("READY")
      ).length > 0
    );
  }
}
