import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

const hasStatus = (status) => (edge) => edge.node.status === status;

export default class DistributionAbility extends Ability {
  @service("caluma-distribution-controls") controls;

  get canSendInquiries() {
    return (
      this.controls.workItems.value?.send.edges.filter(hasStatus("SUSPENDED"))
        .length > 0
    );
  }

  get canCreateInquiry() {
    return (
      this.controls.workItems.value?.create.edges.filter(hasStatus("READY"))
        .length > 0
    );
  }

  get canComplete() {
    return (
      this.controls.workItems.value?.complete.edges.filter(hasStatus("READY"))
        .length > 0
    );
  }
}
