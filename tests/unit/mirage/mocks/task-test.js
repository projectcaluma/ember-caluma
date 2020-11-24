import { classify } from "@ember/string";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import gql from "graphql-tag";
import { module, test } from "qunit";

module("Unit | Mirage GraphQL Mock | task", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const { id: caseId } = this.server.create("case");
    this.task = this.server.create("task", { caseId });

    this.apollo = this.owner.lookup("service:apollo");
  });

  test("can fetch tasks", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query {
          allTasks {
            edges {
              node {
                id
                name
                createdAt
                createdByUser
              }
            }
          }
        }
      `,
    });

    const __typename = `${classify(this.task.type.toLowerCase())}Task`;
    assert.deepEqual(res.allTasks.edges[0].node, {
      __typename,
      name: this.task.name,
      id: window.btoa(`${__typename}:${this.task.id}`),
      createdByUser: this.task.createdByUser,
      createdAt: this.task.createdAt.toISOString(),
    });
  });
});
