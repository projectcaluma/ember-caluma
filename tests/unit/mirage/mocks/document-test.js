import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import gql from "graphql-tag";
import { module, test } from "qunit";

module("Unit | Mirage GraphQL Mock | document", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const { id: formId } = this.server.create("form", { slug: "test-form" });
    this.document = this.server.create("document", {
      formId,
    });

    this.apollo = this.owner.lookup("service:apollo");
  });

  test("can fetch document", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query {
          allDocuments {
            edges {
              node {
                id
                form {
                  slug
                  name
                }
              }
            }
          }
        }
      `,
    });

    assert.deepEqual(res.allDocuments.edges[0].node, {
      __typename: "Document",
      id: window.btoa(`Document:${this.document.id}`),
      form: {
        __typename: "Form",
        name: this.document.form.name,
        slug: this.document.form.slug,
      },
    });
  });
});
