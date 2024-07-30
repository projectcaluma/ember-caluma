import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cfb-form-editor", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.form = this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      questions: this.server.createList("question", 5),
    });
  });

  test("it renders blockless", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfbFormEditor @slug="test-slug" />`, {
      owner: this.engine,
    });

    assert.dom("[data-test-question-list-item]").exists({ count: 5 });
  });

  test("it renders block style", async function (assert) {
    assert.expect(2);

    await render(
      hbs`<CfbFormEditor @slug="test-slug">
  Content!
</CfbFormEditor>`,
      { owner: this.engine },
    );

    assert.dom("[uk-grid] > div:first-of-type").hasText("Content!");
    assert.dom("[data-test-question-list]").exists();
  });
});
