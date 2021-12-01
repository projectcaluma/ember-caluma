import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

import config from "@projectcaluma/ember-distribution/config";

export default class InquiryAbility extends Ability {
  @service calumaOptions;

  @config config;

  get canEdit() {
    return (
      this.model?.task.slug === this.config.inquiry.task &&
      this.model?.status === "SUSPENDED" &&
      this.model?.controllingGroups
        .map(String)
        .includes(String(this.calumaOptions.currentGroupId))
    );
  }

  get canAnswer() {
    return (
      this.model?.task.slug === this.config.inquiry.task &&
      this.model?.status === "READY" &&
      this.model?.addressedGroups
        .map(String)
        .includes(String(this.calumaOptions.currentGroupId))
    );
  }

  get canEditAnswerForm() {
    return (
      this.canAnswer &&
      this.model?.childCase.workItems.edges.some(
        (edge) => edge.node.task.__typename === "CompleteWorkflowFormTask"
      )
    );
  }
}
