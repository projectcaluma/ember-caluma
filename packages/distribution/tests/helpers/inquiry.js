import { settled } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { DateTime } from "luxon";

class StubInquiry {
  @tracked status;
  @tracked document;
  @tracked childCase;
  @tracked addressedGroups;
  @tracked controllingGroups;
  @tracked createdAt;
  @tracked closedAt;

  get addressedGroupName() {
    return this.addressedGroups[0];
  }

  get controllingGroupName() {
    return this.controllingGroups[0];
  }

  task = { slug: "inquiry" };

  constructor({
    deadline = DateTime.now().plus({ days: 5 }).toISODate(),
    status = { value: "inquiry-answer-status-positive", label: "Positive" },
    workItemStatus = "COMPLETED",
    remark = "Remark",
    reason = "Reason",
    addressedGroups = ["addressed"],
    controllingGroups = ["controlling"],
    createdAt = DateTime.now().minus({ days: 5 }).toISO(),
    closedAt = DateTime.now().toISO(),
  }) {
    this.status = workItemStatus;
    this.addressedGroups = addressedGroups;
    this.controllingGroups = controllingGroups;
    this.createdAt = createdAt;
    this.closedAt = closedAt;
    this.document = {
      deadline: {
        edges: [
          {
            node: new (class {
              @tracked value = deadline;
            })(),
          },
        ],
      },
      info: {
        edges: [
          {
            node: new (class {
              @tracked value = remark;
            })(),
          },
        ],
      },
    };
    this.childCase = {
      status: "READY",
      document: {
        status: {
          edges: [
            {
              node: new (class {
                @tracked value = status.value;
                @tracked selectedOption = { label: status.label };
              })(),
            },
          ],
        },
        info: {
          edges: [
            {
              node: new (class {
                @tracked value = reason;
              })(),
            },
          ],
        },
      },
    };
  }

  async setDeadline(value) {
    this.document.deadline.edges[0].node.value = value;

    await settled();
  }

  async setStatus(value, label) {
    this.childCase.document.status.edges[0].node.value = value;
    this.childCase.document.status.edges[0].node.selectedOption = { label };

    await settled();
  }

  async setReady() {
    this.status = "READY";
    await settled();
  }

  async setSuspended() {
    this.status = "SUSPENDED";
    await settled();
  }
}

export default function inquiry(options = {}) {
  return new StubInquiry(options);
}
