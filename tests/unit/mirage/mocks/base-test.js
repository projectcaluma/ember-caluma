import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import gql from "graphql-tag";
import BaseMock from "ember-caluma/mirage-graphql/mocks/base";

module("Unit | Mirage GraphQL Mock | base", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.form = this.server.create("form", {
      name: "Test Form",
      slug: "test-form",
    });

    this.apollo = this.owner.lookup("service:apollo");
  });

  test("ignores unregistered methods", function (assert) {
    const x = new BaseMock("x");
    const proto = Reflect.getPrototypeOf(x);

    Reflect.defineProperty(proto, "method1", {
      enumerable: true,
      value: () => {},
    });

    Reflect.defineProperty(proto, "method2", { enumerable: true, value: {} });

    assert.equal(Object.keys(x.getHandlers()).length, 3);
  });

  test("can query a single record", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query Form($id: ID!) {
          node(id: $id) {
            ... on Form {
              name
              slug
            }
          }
        }
      `,
      variables: {
        id: btoa("Form:test-form"),
      },
    });

    assert.deepEqual(res.node, {
      name: "Test Form",
      slug: "test-form",
      __typename: "Form",
    });
  });

  test("can query a list of records", async function (assert) {
    assert.expect(2);

    this.server.create("form");

    const res = await this.apollo.query({
      query: gql`
        query {
          allForms {
            edges {
              node {
                name
                slug
              }
            }
          }
        }
      `,
    });

    assert.equal(res.allForms.edges.length, 2);
    assert.deepEqual(res.allForms.edges[0].node, {
      name: "Test Form",
      slug: "test-form",
      __typename: "Form",
    });
  });

  test("can create or update a record", async function (assert) {
    assert.expect(4);

    assert.equal(this.server.db.forms.length, 1);

    const createRes = await this.apollo.mutate({
      mutation: gql`
        mutation SaveForm($input: SaveFormInput!) {
          saveForm(input: $input) {
            form {
              name
              slug
            }
          }
        }
      `,
      variables: {
        input: {
          name: "New Form!",
          slug: "new-slug",
        },
      },
    });

    assert.equal(this.server.db.forms.length, 2);
    assert.deepEqual(createRes.saveForm.form, {
      name: "New Form!",
      slug: "new-slug",
      __typename: "Form",
    });

    const updateRes = await this.apollo.mutate({
      mutation: gql`
        mutation SaveForm($input: SaveFormInput!) {
          saveForm(input: $input) {
            form {
              name
              slug
              isArchived
            }
          }
        }
      `,
      variables: {
        input: {
          name: "Updated Form!",
          slug: "new-slug",
        },
      },
    });

    assert.deepEqual(updateRes.saveForm.form, {
      name: "Updated Form!",
      slug: "new-slug",
      isArchived: false,
      __typename: "Form",
    });
  });
});
