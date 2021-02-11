import { render, fillIn, blur, click } from "@ember/test-helpers";
import graphqlError from "dummy/tests/helpers/graphql-error";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { selectChoose } from "ember-power-select/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cfb-form-editor/question", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.server.create("format-validator", { slug: "email" });
  });

  test("it renders", async function (assert) {
    assert.expect(3);

    this.server.create("question", {
      label: "Test Label",
      slug: "test-slug",
      type: "TEXT",
    });

    await render(hbs`{{cfb-form-editor/question slug='test-slug'}}`);

    assert.dom("[name=label]").hasValue("Test Label");
    assert.dom("[name=slug]").hasValue("test-slug");
    assert.dom("[name=slug]").isDisabled();
  });

  test("it validates", async function (assert) {
    assert.expect(1);

    this.server.create("question", {
      label: "Test Label",
      slug: "test-slug",
      type: "TEXT",
    });

    await render(hbs`{{cfb-form-editor/question slug='test-slug'}}`);

    await fillIn("[name=label]", "");
    await blur("[name=label]");

    assert.dom("[name=label] + span").hasText("Label can't be blank");
  });

  test("it can edit a question", async function (assert) {
    assert.expect(4);

    this.server.create("question", {
      label: "Test Label",
      slug: "test-slug",
      type: "TEXT",
    });

    this.set("afterSubmit", (question) => {
      assert.ok(question);
      assert.equal(question.label, "Test Label 1");
      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question slug='test-slug' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=label]", "Test Label 1");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it respects existing metadata", async function (assert) {
    assert.expect(4);

    this.server.create("question", {
      label: "Test Label",
      slug: "test-slug",
      type: "TEXT",
      meta: { someMetaKey: "foobar" },
    });

    this.set("afterSubmit", (question) => {
      assert.ok(question);
      assert.equal(question.meta.someMetaKey, "foobar");
      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question slug='test-slug' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=label]", "Test Label 1");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can handle errors", async function (assert) {
    assert.expect(1);

    this.server.create("question", { slug: "foo-bar-test-slug" });

    this.set("afterSubmit", () => assert.step("after-submit"));

    // The namespace is not really needed for the test
    // but is there to maximize code coverage.
    this.owner.lookup("service:caluma-options").setNamespace("Foo Bar");

    // edit question
    await render(
      hbs`{{cfb-form-editor/question
        slug='foo-bar-test-slug'
        on-after-submit=(action afterSubmit)
      }}`
    );

    this.server.post("/graphql", () => graphqlError("saveQuestion"), 200);
    // We need to add a change to enable the submit button
    await fillIn("input[name=label]", "Test");
    await click("button[type=submit]");

    assert.verifySteps([]);
  });

  test("it can handle 404 errors", async function (assert) {
    assert.expect(1);

    this.server.post("/graphql", () => ({
      data: { allQuestions: { edges: [], __typename: "QuestionEdges" } },
    }));

    await render(hbs`{{cfb-form-editor/question slug='test-slug'}}`);

    assert
      .dom("p")
      .hasText('t:caluma.form-builder.question.not-found:("slug":"test-slug")');
  });

  test("it suggests a slug", async function (assert) {
    assert.expect(1);

    await render(hbs`{{cfb-form-editor/question slug=null}}`);

    await fillIn("input[name=label]", "Test Label 123");
    assert.dom("input[name=slug]").hasValue("test-label-123");
  });

  test("it prepends the slug with a namespace", async function (assert) {
    assert.expect(3);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.slug, "foo-bar-slug");
      assert.step("after-submit");
    });

    this.owner.lookup("service:caluma-options").setNamespace("Foo Bar");

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "TextQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a text question", async function (assert) {
    assert.expect(7);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "TextQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.equal(question.minLength, 10);
      assert.equal(question.maxLength, 20);

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "TextQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=minLength]", 10);
    await fillIn("[name=maxLength]", 20);

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a textarea question", async function (assert) {
    assert.expect(7);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "TextareaQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.equal(question.minLength, 10);
      assert.equal(question.maxLength, 20);

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "TextareaQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=minLength]", 10);
    await fillIn("[name=maxLength]", 20);

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create an integer question", async function (assert) {
    assert.expect(7);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "IntegerQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.equal(question.integerMinValue, -20);
      assert.equal(question.integerMaxValue, 20);

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "IntegerQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=integerMinValue]", -20);
    await fillIn("[name=integerMaxValue]", 20);

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a float question", async function (assert) {
    assert.expect(7);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "FloatQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.equal(question.floatMinValue, -20);
      assert.equal(question.floatMaxValue, 20);

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "FloatQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=floatMinValue]", -20);
    await fillIn("[name=floatMaxValue]", 20);

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a multiple choice question", async function (assert) {
    assert.expect(8);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "MultipleChoiceQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.equal(question.options.edges[0].node.slug, "slug-option-1");
      assert.equal(question.options.edges[0].node.label, "Option 1");
      assert.equal(question.meta.hideLabel, true);

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "MultipleChoiceQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=option-1-label]", "Option 1");
    await fillIn("[name=option-1-slug]", "option-1");
    await click("[data-test-hide-label] div div span input");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a radio question", async function (assert) {
    assert.expect(7);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "ChoiceQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.equal(question.options.edges[0].node.slug, "slug-option-1");
      assert.equal(question.options.edges[0].node.label, "Option 1");

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "ChoiceQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=option-1-label]", "Option 1");
    await fillIn("[name=option-1-slug]", "option-1");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a table question", async function (assert) {
    assert.expect(6);

    this.server.create("form", { slug: "test-form" });
    this.server.create("form", { slug: "subform" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "TableQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.ok(question.rowForm.slug);

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "TableQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=rowForm\\.slug]", "subform");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a form question", async function (assert) {
    assert.expect(6);

    this.server.create("form", { slug: "test-form" });
    this.server.create("form", { slug: "subform" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "FormQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.ok(question.subForm.slug);

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "FormQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=subForm\\.slug]", "subform");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a file question", async function (assert) {
    assert.expect(5);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "FileQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "FileQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a static question", async function (assert) {
    assert.expect(6);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.equal(question.__typename, "StaticQuestion");
      assert.equal(question.label, "Label");
      assert.equal(question.slug, "slug");
      assert.equal(question.staticContent, "#bazz");

      assert.step("after-submit");
    });

    await render(
      hbs`{{cfb-form-editor/question form='test-form' on-after-submit=(action afterSubmit)}}`
    );

    await fillIn("[name=__typename]", "StaticQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=staticContent]", "#bazz");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it validates the slug", async function (assert) {
    assert.expect(3);

    this.server.create("question", { slug: "test-slug" });
    this.server.create("question", { slug: "other-test-slug" });

    await render(hbs`{{cfb-form-editor/question slug=null}}`);

    await fillIn("input[name=slug]", "test-slug");
    await blur("input[name=slug]");

    assert
      .dom("input[name=slug] + span")
      .hasText("t:caluma.form-builder.validations.question.slug:()");

    await fillIn("input[name=slug]", "valid-slug");
    await blur("input[name=slug]");

    assert.dom("input[name=slug] + span").doesNotExist();

    await fillIn("input[name=slug]", "other-test-slug");
    await blur("input[name=slug]");

    assert
      .dom("input[name=slug] + span")
      .hasText("t:caluma.form-builder.validations.question.slug:()");
  });

  test("it auto-suggests the slug if it has not been manually changed", async function (assert) {
    assert.expect(3);

    await render(hbs`{{cfb-form-editor/question slug=null}}`);

    await fillIn("input[name=label]", "Foo Bar");
    await blur("input[name=label]");

    assert.dom("input[name=slug]").hasValue("foo-bar");

    await fillIn("input[name=slug]", "x-y");
    await blur("input[name=slug]");

    assert.dom("input[name=slug]").hasValue("x-y");

    await fillIn("input[name=label]", "Something Else");
    await blur("input[name=label]");

    assert.dom("input[name=slug]").hasValue("x-y");
  });

  test("it allows to select format-validators", async function (assert) {
    assert.expect(1);

    await render(hbs`{{cfb-form-editor/question}}`);
    await selectChoose(
      ".ember-power-select-trigger",
      ".ember-power-select-option"
    );

    assert.dom(".ember-power-select-multiple-option").exists();
  });
});
