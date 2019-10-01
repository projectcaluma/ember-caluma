import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Helper | get-widget", function(hooks) {
  setupRenderingTest(hooks);

  test("it returns valid overrides", async function(assert) {
    const calumaOptions = this.owner.lookup("service:calumaOptions");

    calumaOptions.registerComponentOverride({
      label: "Some Component",
      component: "some-component"
    });

    await render(
      hbs`{{get-widget (hash meta=(hash widgetOverride="some-component"))}}`
    );

    assert.dom(this.element).hasText("some-component");
  });

  test("it doesn't return an invalid override", async function(assert) {
    await render(
      hbs`{{get-widget (hash meta=(hash widgetOverride="some-component"))}}`
    );

    assert.dom(this.element).hasText("cf-field/input");
  });

  test("it has a fallback", async function(assert) {
    await render(hbs`{{get-widget null}}`);

    assert.dom(this.element).hasText("cf-field/input");

    await render(hbs`{{get-widget undefined}}`);

    assert.dom(this.element).hasText("cf-field/input");
  });

  test("it can pass the default widget", async function(assert) {
    await render(hbs`{{get-widget null default="cf-form"}}`);

    assert.dom(this.element).hasText("cf-form");
  });

  test("it can handle multiple objects", async function(assert) {
    const calumaOptions = this.owner.lookup("service:calumaOptions");

    calumaOptions.registerComponentOverride({
      label: "Some Component",
      component: "some-component"
    });

    await render(
      hbs`{{get-widget
        null
        (hash meta=(hash widgetOverride="some-invalid-component"))
        (hash meta=(hash widgetOverride="some-component"))
      }}`
    );

    assert.dom(this.element).hasText("some-component");
  });
});
