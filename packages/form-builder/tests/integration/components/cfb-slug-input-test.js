import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cfb-slug-input", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders without a prefix", async function (assert) {
    await render(hbs`<CfbSlugInput @value="my-slug" />`, {
      owner: this.engine,
    });

    assert.dom("input").hasValue("my-slug");
    assert.dom("span.cfb-slug-input__prefix").doesNotExist();
  });

  test("it renders with a prefix if namespace is given", async function (assert) {
    this.owner.lookup("service:caluma-options").namespace = "test";

    await render(hbs`<CfbSlugInput @value="test-my-slug" />`, {
      owner: this.engine,
    });

    assert.dom("input").hasValue("my-slug");
    assert.dom("span.cfb-slug-input__prefix").hasText("test-");
  });

  test("it renders with a prefix if passed", async function (assert) {
    await render(
      hbs`<CfbSlugInput @value="question-1-my-slug" @prefix="question-1" />`,
      { owner: this.engine },
    );

    assert.dom("input").hasValue("my-slug");
    assert.dom("span.cfb-slug-input__prefix").hasText("question-1-");
  });

  test("it hides the prefix if disabled or hidePrefix passed", async function (assert) {
    this.disabled = true;
    this.hidePrefix = false;

    await render(
      hbs`<CfbSlugInput
  @value="question-1-my-slug"
  @prefix="question-1"
  @disabled={{this.disabled}}
  @hidePrefix={{this.hidePrefix}}
/>`,
      { owner: this.engine },
    );

    assert.dom("input").isDisabled();
    assert.dom("input").hasValue("question-1-my-slug");
    assert.dom("span.cfb-slug-input__prefix").doesNotExist();

    this.set("hidePrefix", true);

    assert.dom("input").hasValue("my-slug");
    assert.dom("span.cfb-slug-input__prefix").doesNotExist();

    this.set("disabled", false);

    assert.dom("input").isEnabled();
    assert.dom("input").hasValue("my-slug");
    assert.dom("span.cfb-slug-input__prefix").doesNotExist();
  });
});
