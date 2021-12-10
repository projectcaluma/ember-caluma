import moment from "moment";

import {
  register,
  deserialize,
} from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";
import { createInquiry } from "@projectcaluma/ember-testing/scenarios/distribution";

export default class extends BaseMock {
  @register("ResumeWorkItemPayload")
  handleResumeWorkItem(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { id: input.id, status: "READY" },
    });
  }

  @register("SuspendWorkItemPayload")
  handleSuspendWorkItem(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { id: input.id, status: "SUSPENDED" },
    });
  }

  @register("CompleteWorkItemPayload")
  handleCompleteWorkItem(_, { input }) {
    const { id } = deserialize(input);

    const workItem = this.collection.find(id);

    const taskId = workItem.taskId;
    const caseId = workItem.caseId;

    /**
     * Disclaimer: this is a static configuration of a pre-configured workflow
     * in the distribution scenario and should most likely be handled properly
     * like the backend does. However, this small requirement does not justify a
     * complex implementation of backend logic which is why we keep this static
     * for now.
     */
    if (["adjust-inquiry-answer", "compose-inquiry-answer"].includes(taskId)) {
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
    } else if (taskId === "confirm-inquiry-answer") {
      this.collection
        .findBy({ caseId, taskId: "revise-inquiry-answer" })
        .update({ status: "CANCELED" });
      this.collection
        .findBy({ childCaseId: caseId })
        .update({ status: "COMPLETED" });
      this.schema.cases.find(caseId).update({ status: "COMPLETED" });
    } else if (taskId === "revise-inquiry-answer") {
      this.collection
        .findBy({ caseId, taskId: "confirm-inquiry-answer" })
        .update({ status: "CANCELED" });
      this.server.create("work-item", {
        caseId,
        status: "READY",
        taskId: "adjust-inquiry-answer",
      });
    } else if (taskId === "create-inquiry") {
      const { addressed_groups: groups } = JSON.parse(input.context);

      groups.forEach((group) => {
        createInquiry(
          this.server,
          workItem.case,
          {
            to: { id: group },
            from: { id: workItem.addressedGroups[0] },
            remark: "",
            deadline: moment().add(30, "days").toDate(),
          },
          {
            createdAt: new Date(),
          }
        );

        this.server.create("work-item", {
          taskId: "create-inquiry",
          status: "READY",
          addressedGroups: [group],
        });
      });

      this.server.create("work-item", {
        taskId: "create-inquiry",
        status: "READY",
        addressedGroups: workItem.addressedGroups,
      });
    }

    return this.handleSavePayload.fn.call(this, _, {
      input: { id: input.id, status: "COMPLETED" },
    });
  }
}
