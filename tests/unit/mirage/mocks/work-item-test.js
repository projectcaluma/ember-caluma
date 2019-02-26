import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import gql from "graphql-tag";
import { classify } from "@ember/string";

module("Unit | Mirage GraphQL Mock | work item", function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const { id: formId } = this.server.create("form", { slug: "test-form" });
    const { id: documentId } = this.server.create("document", {
      formId
    });
    const { id: caseId } = this.server.create("case", {
      documentId
    });
    const { id: taskId } = this.server.create("task");
    this.workItem = this.server.create("workItem", { caseId, taskId });
    this.caseId = caseId;

    this.apollo = this.owner.lookup("service:apollo");
  });

  test("can fetch workitems", async function(assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query {
          allWorkItems {
            edges {
              node {
                id
                createdAt
                createdByUser
                status
                task {
                  name
                }
              }
            }
          }
        }
      `
    });

    assert.deepEqual(res.allWorkItems.edges[0].node, {
      __typename: "WorkItem",
      id: window.btoa("WorkItem:" + this.workItem.id),
      status: this.workItem.status,
      createdByUser: this.workItem.createdByUser,
      createdAt: this.workItem.createdAt.toISOString(),
      task: {
        __typename: `${classify(this.workItem.task.type.toLowerCase())}Task`,
        name: this.workItem.task.name
      }
    });
  });
});
