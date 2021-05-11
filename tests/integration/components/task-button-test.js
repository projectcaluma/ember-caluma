import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | task-button", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);
  setupMirage(hooks);

  test("it renders default", async function (assert) {
    await render(
      hbs`<TaskButton @mutation="complete" @taskSlug="test" @filters=""/>`
    );

    assert.dom("button").hasText("t:caluma.mutate-work-item.complete:()");
  });

  test("it renders label", async function (assert) {
    await render(
      hbs`<TaskButton @mutation="complete" @taskSlug="test" @label="Lorem Ipsum" @filters=""/>`
    );

    assert.dom("button").hasText("Lorem Ipsum");
  });

  test("it renders block", async function (assert) {
    await render(
      hbs`<TaskButton @mutation="complete" @taskSlug="test" @filters="">Lorem Ipsum</TaskButton>`
    );

    assert.dom("button").hasText("Lorem Ipsum");
  });
});
