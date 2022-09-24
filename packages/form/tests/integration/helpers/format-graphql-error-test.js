import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Helper | format-graphql-error", function (hooks) {
  setupRenderingTest(hooks);

  test("formats graphql errors properly", async function (assert) {
    this.error = {
      errors: [
        {
          message: "Error 1",
          locations: [{ line: 1, column: 2 }],
          path: ["allForms", "edges", 0, "node", "id"],
        },
        {
          message: "Error 2",
          locations: [{ line: 15, column: 3 }],
          path: ["allForms", "pageInfo", "endCursor"],
        },
      ],
    };

    await render(hbs`{{format-graphql-error this.error}}`);

    assert
      .dom(this.element)
      .hasText(
        "allForms.edges.0.node.id:1:2: Error 1 allForms.pageInfo.endCursor:15:3: Error 2"
      );
  });

  test("it ignores unformattable errors", async function (assert) {
    this.error = { message: "Error" };

    await render(hbs`{{format-graphql-error this.error}}`);

    assert.dom(this.element).hasText("");
  });
});
