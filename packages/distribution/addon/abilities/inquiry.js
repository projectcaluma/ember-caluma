import { inject as service } from "@ember/service";
import { Ability } from "ember-can";
import { DateTime } from "luxon";

import config from "@projectcaluma/ember-distribution/config";

/**
 * This class contains all permission definitions for inquiries. To improve
 * performance there are a few helpers and rules for optimal permission
 * computation. The permissions need to be ordered by how expensive their
 * computation is: the least expensive first and the most expensive last and so
 * on:
 *
 * 1. Static config properties (e.g. `enableReminders`)
 * 2. Base permission which checks for the correct task and the readonly config
 * 3. Simple work item property checks (e.g. `isReady` or `isSuspended`)
 * 4. Addressed / controlling group affiliation (e.g. `isAddressed` or `isControlling`)
 * 5. All other computations (e.g. whether the deadline is overdue)
 * 6. Custom permissions served by the host app (using `hasCustomPermission`)
 */
export default class InquiryAbility extends Ability {
  @service calumaOptions;

  @config config;

  hasCustomPermission(permissionName, ...args) {
    return this.config.permissions[permissionName]?.(...args) ?? true;
  }

  get hasBasePermission() {
    return (
      !this.config.ui.readonly &&
      this.model?.task.slug === this.config.inquiry.task
    );
  }

  get isReady() {
    return this.model.status === "READY";
  }

  get isSuspended() {
    return this.model.status === "SUSPENDED";
  }

  get isAddressed() {
    return this.model.addressedGroups
      .map(String)
      .includes(String(this.calumaOptions.currentGroupId));
  }

  get isControlling() {
    return this.model.controllingGroups
      .map(String)
      .includes(String(this.calumaOptions.currentGroupId));
  }

  get canEdit() {
    return (
      this.hasBasePermission &&
      (this.isSuspended || this.isReady) &&
      this.isControlling &&
      this.hasCustomPermission("editInquiry", this.model)
    );
  }

  get canSend() {
    return (
      this.hasBasePermission &&
      this.isSuspended &&
      this.isControlling &&
      this.hasCustomPermission("sendInquiry", this.model)
    );
  }

  get canWithdraw() {
    return (
      this.hasBasePermission &&
      this.isSuspended &&
      this.isControlling &&
      this.hasCustomPermission("withdrawInquiry", this.model)
    );
  }

  get canAnswer() {
    return this.hasBasePermission && this.isReady && this.isAddressed;
  }

  get canEditAnswerForm() {
    return (
      this.canAnswer &&
      this.model.childCase.workItems.edges.some(
        (edge) =>
          edge.node.status === "READY" &&
          edge.node.task.__typename === "CompleteWorkflowFormTask"
      )
    );
  }

  get canCompleteChildWorkItem() {
    return (
      this.hasBasePermission &&
      this.hasCustomPermission(
        "completeInquiryChildWorkItem",
        this.model,
        this.task
      )
    );
  }

  get canReopen() {
    return (
      this.hasBasePermission &&
      this.model.isRedoable &&
      this.isControlling &&
      this.hasCustomPermission("reopenInquiry", this.model)
    );
  }

  get canSendReminder() {
    return (
      this.config.enableReminders &&
      this.hasBasePermission &&
      this.isReady &&
      this.isControlling &&
      DateTime.fromISO(
        this.model.document?.deadline.edges[0]?.node.value
      ).diffNow("days").days <= 0 &&
      this.hasCustomPermission("sendReminder", this.model)
    );
  }
}
