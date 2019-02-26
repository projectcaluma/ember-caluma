import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import gql from "graphql-tag";

module("Unit | Mirage GraphQL Mock | case", function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const { id: formId } = this.server.create("form", { slug: "test-form" });
    const { id: documentId } = this.server.create("document", {
      formId
    });
    this.case = this.server.create("case", {
      documentId
    });

    this.apollo = this.owner.lookup("service:apollo");
  });

  test("can fetch case", async function(assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query {
          allCases {
            edges {
              node {
                id
                createdByUser
                createdAt
              }
            }
          }
        }
      `
    });

    assert.deepEqual(res.allCases.edges[0].node, {
      __typename: "Case",
      id: window.btoa("Case:" + this.case.id),
      createdByUser: this.case.createdByUser,
      createdAt: this.case.createdAt.toISOString()
    });
  });
});
