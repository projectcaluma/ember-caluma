import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, fillIn, blur } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | cfb-form-editor/general", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders", async function(assert) {
    assert.expect(4);

    this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      description: "Test Description"
    });

    await render(hbs`{{cfb-form-editor/general slug='test-slug'}}`);

    assert.dom("input[name=name]").hasValue("Test Name");
    assert.dom("input[name=slug]").hasValue("test-slug");
    assert.dom("input[name=slug]").isDisabled();
    assert.dom("textarea[name=description]").hasValue("Test Description");
  });

  test("it validates", async function(assert) {
    assert.expect(2);

    this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      description: "Test Description"
    });

    await render(hbs`{{cfb-form-editor/general slug='test-slug'}}`);

    await fillIn("input[name=name]", "");
    await blur("input[name=name]");

    assert.dom("form button[type=submit]").isDisabled();
    assert.dom("input[name=name] + span").hasText("Name can't be blank");
  });

  test("it can create a form", async function(assert) {
    assert.expect(6);

    this.set("afterSubmit", form => {
      assert.ok(form);
      assert.equal(form.slug, "form-slug");
      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/general on-after-submit=(action afterSubmit)}}`
    );

    assert.dom("input[name=slug]").isNotDisabled();

    await fillIn("input[name=name]", "Test Name ##1 12");
    await fillIn("textarea[name=description]", "Test Description");

    assert.dom("input[name=slug]").hasValue("test-name-1-12");

    await fillIn("input[name=slug]", "form-slug");

    await click("form button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can edit a form", async function(assert) {
    assert.expect(4);

    this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      description: "Test Description"
    });

    this.set("afterSubmit", form => {
      assert.ok(form);
      assert.equal(form.name, "Test Name 1");
      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/general slug='test-slug' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("input[name=name]", "Test Name 1");
    await fillIn("textarea[name=description]", "Test Description 1");

    await click("form button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can delete a form", async function(assert) {
    assert.expect(3);

    const { id } = this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      description: "Test Description"
    });

    this.set("afterDelete", () => assert.step("after-delete"));

    await render(
      hbs`{{cfb-form-editor/general slug='test-slug' on-after-delete=(action afterDelete)}}`
    );

    await click("form button[type=button]");

    const form = this.server.schema.forms.find(id);

    assert.notOk(form);
    assert.verifySteps(["after-delete"]);
  });
});
