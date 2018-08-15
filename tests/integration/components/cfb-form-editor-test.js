import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | cfb-form-editor", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders blockless", async function(assert) {
    assert.expect(1);

    this.server.create("form", { name: "Test Name", slug: "test-slug" });

    await render(hbs`{{cfb-form-editor slug='test-slug'}}`);

    assert.dom("h1 > span").hasText("Test Name");
  });

  test("it renders block style", async function(assert) {
    assert.expect(1);

    this.server.create("form", { name: "Test Name", slug: "test-slug" });

    await render(hbs`
      {{#cfb-form-editor slug='test-slug'}}
        Content!
      {{/cfb-form-editor}}
    `);

    assert.dom("[uk-grid] > div:first-of-type").hasText("Content!");
  });

  test("it can trigger a back action", async function(assert) {
    assert.expect(2);

    this.server.create("form", { name: "Test Name", slug: "test-slug" });

    this.set("back", () => assert.step("back"));

    await render(
      hbs`{{cfb-form-editor slug='test-slug' on-back=(action back)}}`
    );

    await click("h1 > span > button");

    assert.verifySteps(["back"]);
  });
});
