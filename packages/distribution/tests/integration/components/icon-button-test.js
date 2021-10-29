import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | icon-button", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (assert) {
    this.onClick = () => assert.step("click");
  });

  test("it renders uikit icon buttons", async function (assert) {
    await render(hbs`<IconButton @icon="plus" @onClick={{this.onClick}} />`);

    assert.dom("button.uk-icon-button > svg").exists();
  });

  test("it renders icon buttons from svg-jar", async function (assert) {
    await render(
      hbs`<IconButton @icon="add-outline" @fromSvgJar={{true}} @onClick={{this.onClick}} />`
    );

    assert.dom("button.uk-icon-button > svg").exists();
  });

  test("it applies gutter classes", async function (assert) {
    await render(hbs`
      <IconButton
        @icon="add-outline"
        @fromSvgJar={{true}}
        @gutter={{1}}
        @gutterLeft={{2}}
        @gutterTop={{3}}
        @gutterRight={{4}}
        @gutterBottom={{5}}
        @onClick={{this.onClick}}
      />
    `);

    assert.dom("button.uk-icon-button").hasClass("uk-icon-button--gutter-1");
    assert
      .dom("button.uk-icon-button")
      .hasClass("uk-icon-button--gutter-left-2");
    assert
      .dom("button.uk-icon-button")
      .hasClass("uk-icon-button--gutter-top-3");
    assert
      .dom("button.uk-icon-button")
      .hasClass("uk-icon-button--gutter-right-4");
    assert
      .dom("button.uk-icon-button")
      .hasClass("uk-icon-button--gutter-bottom-5");
  });

  test("it triggers passed action on click", async function (assert) {
    await render(hbs`<IconButton @icon="plus" @onClick={{this.onClick}} />`);
    await click("button");
    assert.verifySteps(["click"]);
  });
});
