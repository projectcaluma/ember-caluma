import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, fillIn, blur } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

const generateErrorObjForGraph = name => ({
  data: { [name]: null },
  errors: [
    {
      message: "Test Error",
      locations: [
        {
          line: 1,
          column: 1
        }
      ],
      path: name
    }
  ]
});

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

    await click("[data-test-submit]");

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

    await click("[data-test-submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can archive a form", async function(assert) {
    assert.expect(3);

    const { id } = this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      description: "Test Description"
    });

    this.set("afterArchive", () => assert.step("after-archive"));

    await render(
      hbs`{{cfb-form-editor/general slug='test-slug' on-after-archive=(action afterArchive)}}`
    );

    await click("[data-test-archive]");

    assert.ok(this.server.schema.forms.find(id).isArchived);
    assert.verifySteps(["after-archive"]);
  });

  test("it can handle errors", async function(assert) {
    assert.expect(1);

    this.server.create("form", { slug: "test-form" });

    this.set("afterArchive", () => assert.step("after-archive"));
    this.set("afterSubmit", () => assert.step("after-submit"));

    // edit form
    await render(
      hbs`{{cfb-form-editor/general
        slug='test-form'
        on-after-archive=(action afterArchive)
        on-after-submit=(action afterSubmit)
      }}`
    );

    this.server.post(
      "/graphql",
      () => generateErrorObjForGraph("saveForm"),
      200
    );
    await click("[data-test-archive]");
    await click("[data-test-submit]");

    // new form
    await render(
      hbs`{{cfb-form-editor/general slug=null on-after-submit=(action afterSubmit)}}`
    );
    await fillIn("input[name=name]", "Test");
    await click("[data-test-submit]");

    assert.verifySteps([]);
  });
});
