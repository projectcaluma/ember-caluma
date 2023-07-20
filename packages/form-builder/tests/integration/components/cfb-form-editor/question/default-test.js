import { render } from "@ember/test-helpers";
import { Changeset } from "ember-changeset";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module(
  "Integration | Component | cfb-form-editor/question/default",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      this.changeset = new Changeset({
        __typename: "TextQuestion",
        slug: "test",
      });
      this.noop = () => {};

      await render(hbs`<CfbFormEditor::Question::Default
  @name="test"
  @model={{this.changeset}}
  @update={{this.noop}}
  @setDirty={{this.noop}}
/>`);

      assert.ok(this.element);
    });
  },
);
