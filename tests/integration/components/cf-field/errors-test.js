import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field/errors", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    await render(hbs`
      {{cf-field/errors
        field=(hash
          errors=(array "foo" "bar")
        )
      }}
    `);

    assert.dom().hasText("foo, bar");
  });
});
