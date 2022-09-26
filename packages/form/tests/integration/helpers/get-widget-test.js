import { setComponentTemplate } from "@ember/component";
import { render } from "@ember/test-helpers";
import Component from "@glimmer/component";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Helper | get-widget", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // eslint-disable-next-line ember/no-empty-glimmer-component-classes
    class SomeComponent extends Component {}
    setComponentTemplate(hbs`some-component`, SomeComponent);

    this.SomeComponent = SomeComponent;

    this.owner.register("component:some-component", SomeComponent);
  });

  test("it returns valid overrides", async function (assert) {
    this.owner.lookup("service:calumaOptions").registerComponentOverride({
      label: "Some Component",
      component: "some-component",
    });

    await render(hbs`
      {{component
        (ensure-safe-component
          (get-widget
            (hash
              raw=(hash
                meta=(hash widgetOverride="some-component")
              )
            )
          )
        )
      }}
    `);

    assert.dom(this.element).hasText("some-component");
  });

  test("it doesn't return an invalid override", async function (assert) {
    await render(hbs`
      {{component
        (ensure-safe-component
          (get-widget
            (hash
              raw=(hash
                meta=(hash widgetOverride="some-component")
              )
            )
          )
        )
        field=(hash question=(hash raw=(hash __typename="TextQuestion")))
      }}
    `);

    assert.dom("input").exists();
  });

  test("it has a fallback", async function (assert) {
    await render(hbs`
      {{component
        (ensure-safe-component (get-widget null))
        field=(hash question=(hash raw=(hash __typename="TextQuestion")))
      }}
    `);

    assert.dom("input").exists();

    await render(hbs`
      {{component
        (ensure-safe-component (get-widget undefined))
        field=(hash question=(hash raw=(hash __typename="TextQuestion")))
      }}
    `);

    assert.dom("input").exists();
  });

  test("it can pass the default widget", async function (assert) {
    await render(
      hbs`{{component (ensure-safe-component (get-widget null default="cf-form"))}}`
    );

    assert.dom("form").exists();
  });

  test("it can handle multiple objects", async function (assert) {
    this.owner.lookup("service:calumaOptions").registerComponentOverride({
      label: "Some Component",
      component: "some-component",
    });

    await render(hbs`
      {{component
        (ensure-safe-component
          (get-widget
            null
            (hash raw=(hash meta=(hash widgetOverride="some-invalid-component")))
            (hash raw=(hash meta=(hash widgetOverride="some-component")))
          )
        )
      }}
    `);

    assert.dom(this.element).hasText("some-component");
  });

  test("it can handle component classes", async function (assert) {
    this.owner.lookup("service:calumaOptions").registerComponentOverride({
      label: "Some Component",
      component: "some-component",
      componentClass: this.SomeComponent,
    });

    await render(hbs`
      {{component
        (ensure-safe-component
          (get-widget
            (hash
              raw=(hash
                meta=(hash widgetOverride="some-component")
              )
            )
          )
        )
      }}
    `);

    assert.dom(this.element).hasText("some-component");
  });
});
