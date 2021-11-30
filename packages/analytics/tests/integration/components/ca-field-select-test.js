import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { selectChoose } from "ember-power-select/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test, todo } from "qunit";

module("Integration | Component | ca-field-select", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function (assert) {
    this.set("update", () => assert.step("selection"));
  });

  test("it renders", async function (assert) {
    assert.expect(1);

    await render(hbs`<CaFieldSelect @path="" @onSelect={{this.update}}/>`);

    assert.dom(this.element).exists();
  });

  test("it renders as child", async function (assert) {
    assert.expect(2);

    await render(
      hbs`<CaFieldSelect @path="" @child={{true}} @onSelect={{this.update}}/>`
    );

    assert.dom(this.element).exists();
    assert.dom("[data-test-field-select-seperator]").exists({ count: 1 });
  });

  todo("it renders recursivley", async function (assert) {
    this.set("path", "grandpa.father.son");

    // TODO: setup mirage to satisfy *fetchOptions

    await render(hbs`<CaFieldSelect
      @selectedPath={{this.path}}
      @onSelect={{this.update}}
    />`);

    assert
      .dom("[data-test-field-select-primary-selector]")
      .exists({ count: 1 });
    assert
      .dom("[data-test-field-select-primary-selector]")
      .containsText("grandpa");
    assert
      .dom("[data-test-field-select-secondary-selector]")
      .exists({ count: 2 });
    assert.dom("[data-test-field-select-seperator]").exists({ count: 2 });
  });

  test("it updates child selectors when path changes", async function (assert) {
    assert.expect(6);
    this.set("path", "grandpa.father.son");

    await render(hbs`<CaFieldSelect
      @selectedPath={{this.path}}
      @parentPath=""
      @onSelect={{this.update}}
    />`);

    assert
      .dom("[data-test-field-select-primary-selector]")
      .exists({ count: 1 });
    assert
      .dom("[data-test-field-select-secondary-selector]")
      .exists({ count: 2 });

    this.set("path", "nanny.mommi");
    assert
      .dom("[data-test-field-select-primary-selector]")
      .exists({ count: 1 });
    assert
      .dom("[data-test-field-select-secondary-selector]")
      .exists({ count: 1 });

    this.set("path", "nanny");
    assert
      .dom("[data-test-field-select-primary-selector]")
      .exists({ count: 1 });
    assert.dom("[data-test-field-select-secondary-selector]").doesNotExist();
  });

  todo("fetches options on dropdown open", async function () {});

  todo(
    "it triggers the update function on selection change",
    async function (assert) {
      assert.expect(2);

      this.set("path", "grandpa.father.son");

      await render(hbs`<CaFieldSelect
        @selectedPath={{this.path}}
        @onSelect={{this.update}}
      />`);
      selectChoose(".ember-power-select-trigger", "father");

      assert.verifySteps(["selection"]);
    }
  );
});
