import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import gql from "graphql-tag";
import { classify } from "@ember/string";

module("Unit | Mirage GraphQL Mock | work item", function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.apollo = this.owner.lookup("service:apollo");
  });

  test("can fetch workitems", async function(assert) {
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

  test("can fetch nested data", async function(assert) {
    const { id: taskId } = this.server.create("task");
    const { id: workflowId } = this.server.create("workflow", {
      taskId: taskId
    });
    const { id: formId } = this.server.create("form", { slug: "test-form" });
    const { id: documentId } = this.server.create("document", {
      formId
    });
    const { id: childWorkItemId } = this.server.create("workItem", {
      documentId
    });
    const { id: caseId } = this.server.create("case", {
      workflowId,
      workItemIds: [childWorkItemId]
    });
    const { id: workItemId } = this.server.create("workItem", {
      caseId,
      taskId
    });
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query circulationChildCase($workItemId: ID!) {
          node(id: $workItemId) {
            ... on WorkItem {
              id
              childCase {
                id
                workflow {
                  startTasks {
                    id
                  }
                }
                workItems {
                  edges {
                    node {
                      id
                      addressedGroups
                      deadline
                      status
                      meta
                      document {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { workItemId: window.btoa(`WorkItem:${workItemId}`) }
    });
    assert.ok(res.node);
  });
});
