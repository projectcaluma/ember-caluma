import { classify } from "@ember/string";
import { setupTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { gql } from "graphql-tag";
import { module, test } from "qunit";

module("Unit | Mirage GraphQL Filter | work-item", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.apollo = this.owner.lookup("service:apollo");
    const { id: formId } = this.server.create("form", { slug: "test-form" });
    const { id: documentId } = this.server.create("document", {
      formId,
    });
    this.case = this.server.create("case", {
      documentId,
    });
    this.task = this.server.create("task");
    this.otherTask = this.server.create("task");
    this.workItem1 = this.server.create("workItem", {
      caseId: this.case.id,
      taskId: this.task.id,
    });
    this.workItem2 = this.server.create("workItem", {
      caseId: this.case.id,
      taskId: this.otherTask.id,
    });

    this.query = gql`
      query workItems($taskId: ID!, $invert: Boolean!) {
        allWorkItems(filter: [{ task: $taskId, invert: $invert }]) {
          edges {
            node {
              id
              task {
                name
              }
            }
          }
        }
      }
    `;
  });

  test("can filter based on task", async function (assert) {
    const res = await this.apollo.query({
      query: this.query,
      variables: {
        taskId: this.task.id,
        invert: false,
      },
    });

    assert.deepEqual(res.allWorkItems.edges[0].node, {
      __typename: "WorkItem",
      id: window.btoa(`WorkItem:${this.workItem1.id}`),
      task: {
        __typename: `${classify(this.workItem1.task.type.toLowerCase())}Task`,
        name: this.workItem1.task.name,
      },
    });
  });

  test("can invert filter based on task", async function (assert) {
    const res = await this.apollo.query({
      query: this.query,
      variables: {
        taskId: this.task.id,
        invert: true,
      },
    });

    assert.deepEqual(res.allWorkItems.edges[0].node, {
      __typename: "WorkItem",
      id: window.btoa(`WorkItem:${this.workItem2.id}`),
      task: {
        __typename: `${classify(this.workItem2.task.type.toLowerCase())}Task`,
        name: this.workItem2.task.name,
      },
    });
  });
});
