import {
  register,
  deserialize,
} from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

export default class extends BaseMock {
  @register("ResumeWorkItemPayload")
  handleResumeWorkItem(_, { input }) {
    const { id } = deserialize(input);

    this.db.workItems.update(id, { status: "READY" });

    return this.handleSavePayload.fn.call(this, _, { input });
  }

  @register("SuspendWorkItemPayload")
  handleSuspendWorkItem(_, { input }) {
    const { id } = deserialize(input);

    this.db.workItems.update(id, { status: "SUSPENDED" });

    return this.handleSavePayload.fn.call(this, _, { input });
  }

  @register("CompleteWorkItemPayload")
  handleCompleteWorkItem(_, { input }) {
    const { id } = deserialize(input);

    const workItem = this.db.workItems.find(id);
    const caseId = workItem.caseId;

    /**
     * Disclaimer: this is a static configuration of a pre-configured workflow
     * in the distribution scenario and should most likely be handled properly
     * like the backend does. However, this small requirement does not justify a
     * complex implementation of backend logic which is why we keep this static
     * for now.
     */
    if (
      ["adjust-inquiry-answer", "compose-inquiry-answer"].includes(
        workItem.taskId
      )
    ) {
      this.server.create("work-item", {
        caseId,
        status: "READY",
        taskId: "confirm-inquiry-answer",
      });
      this.server.create("work-item", {
        caseId,
        status: "READY",
        taskId: "revise-inquiry-answer",
      });
    } else if (workItem.taskId === "confirm-inquiry-answer") {
      this.db.workItems.update(
        { caseId, taskId: "revise-inquiry-answer" },
        { status: "CANCELED" }
      );
      this.db.workItems.update(
        { childCaseId: caseId },
        { status: "COMPLETED" }
      );
      this.db.cases.update(caseId, { status: "COMPLETED" });
    } else if (workItem.taskId === "revise-inquiry-answer") {
      this.db.workItems.update(
        { caseId, taskId: "confirm-inquiry-answer" },
        { status: "CANCELED" }
      );
      this.server.create("work-item", {
        caseId,
        status: "READY",
        taskId: "adjust-inquiry-answer",
      });
    }

    this.db.workItems.update(id, { status: "COMPLETED" });

    return this.handleSavePayload.fn.call(this, _, { input });
  }
}
