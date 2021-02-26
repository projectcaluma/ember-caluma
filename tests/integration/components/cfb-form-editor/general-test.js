import { render, click, fillIn, blur } from "@ember/test-helpers";
import graphqlError from "dummy/tests/helpers/graphql-error";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cfb-form-editor/general", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    assert.expect(4);

    this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      description: "Test Description",
    });

    await render(hbs`{{cfb-form-editor/general slug='test-slug'}}`);

    assert.dom("input[name=name]").hasValue("Test Name");
    assert.dom("input[name=slug]").hasValue("test-slug");
    assert.dom("input[name=slug]").isDisabled();
    assert.dom("textarea[name=description]").hasValue("Test Description");
  });

  test("it validates", async function (assert) {
    assert.expect(2);

    this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      description: "Test Description",
    });

    await render(hbs`{{cfb-form-editor/general slug='test-slug'}}`);

    await fillIn("input[name=name]", "");
    await blur("input[name=name]");

    assert.dom("form button[type=submit]").isDisabled();
    assert.dom("input[name=name] + span").hasText("Name can't be blank");
  });

  test("it prepends the slug with a namespace", async function (assert) {
    assert.expect(5);

    this.set("afterSubmit", (form) => {
      assert.ok(form);
      assert.equal(form.slug, "foo-bar-form-2");
      assert.step("after-submit");
    });

    this.owner.lookup("service:caluma-options").namespace = "Foo Bar";

    this.server.create("form", {
      name: "Form 1",
      slug: "foo-bar-form-1",
    });

    await render(
      hbs`{{cfb-form-editor/general on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("input[name=name]", "Form 1");
    assert.dom("button[type=submit]").isDisabled();

    await fillIn("input[name=slug]", "form-2");

    await click("button[type=submit]");
    assert.verifySteps(["after-submit"]);
  });

  test("it can create a form", async function (assert) {
    assert.expect(6);

    this.set("afterSubmit", (form) => {
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

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can edit a form", async function (assert) {
    assert.expect(4);

    this.server.create("form", {
      name: "Test Name",
      slug: "test-slug",
      description: "Test Description",
    });

    this.set("afterSubmit", (form) => {
      assert.ok(form);
      assert.equal(form.name, "Test Name 1");
      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/general slug='test-slug' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("input[name=name]", "Test Name 1");
    await fillIn("textarea[name=description]", "Test Description 1");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can handle errors", async function (assert) {
    assert.expect(1);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", () => assert.step("after-submit"));

    // The namespace is not really needed for the test
    // but is there to maximize code coverage.
    this.owner.lookup("service:caluma-options").namespace = "Foo Bar";

    // edit form
    await render(
      hbs`{{cfb-form-editor/general
        slug='test-form'
        on-after-submit=(action afterSubmit)
      }}`
    );

    this.server.post("/graphql", () => graphqlError("saveForm"), 200);
    await click("button[type=submit]");

    // new form
    await render(
      hbs`{{cfb-form-editor/general slug=null on-after-submit=(action afterSubmit)}}`
    );

    // Slug validation must be valid
    this.server.post(
      "/graphql",
      { data: { allForms: { edges: [], __typename: "FormConnection" } } },
      200
    );
    await fillIn("input[name=name]", "test");

    this.server.post("/graphql", () => graphqlError("saveForm"), 200);
    await click("button[type=submit]");

    assert.verifySteps([]);
  });

  test("it can handle 404 errors", async function (assert) {
    assert.expect(1);

    this.server.post("/graphql", () => ({
      data: { allForms: { edges: [], __typename: "FormEdges" } },
    }));

    await render(hbs`{{cfb-form-editor/general slug='test-slug'}}`);

    assert
      .dom("p")
      .hasText('t:caluma.form-builder.form.not-found:("slug":"test-slug")');
  });

  test("it validates the slug", async function (assert) {
    assert.expect(3);

    this.server.create("form", { slug: "test-slug" });
    this.server.create("form", { slug: "other-test-slug" });

    await render(hbs`{{cfb-form-editor/general slug=null}}`);

    await fillIn("input[name=slug]", "test-slug");
    await blur("input[name=slug]");

    assert
      .dom("input[name=slug] + span")
      .hasText("t:caluma.form-builder.validations.form.slug:()");

    await fillIn("input[name=slug]", "valid-slug");
    await blur("input[name=slug]");

    assert.dom("input[name=slug] + span").doesNotExist();

    await fillIn("input[name=name]", "Other Test Slug");
    await blur("input[name=name]");
    await blur("input[name=slug]");

    assert
      .dom("input[name=slug] + span")
      .hasText("t:caluma.form-builder.validations.form.slug:()");
  });
});
