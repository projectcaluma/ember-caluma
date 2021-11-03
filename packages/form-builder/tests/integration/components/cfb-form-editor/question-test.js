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

    await render(hbs`<CfbFormEditor::Question @slug='test-slug'/>`);

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

    await render(hbs`<CfbFormEditor::Question @slug='test-slug'/>`);

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
      assert.strictEqual(question.label, "Test Label 1");
      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @slug='test-slug' @on-after-submit={{this.afterSubmit}}/>`
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
      assert.strictEqual(question.meta.someMetaKey, "foobar");
      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @slug='test-slug' @on-after-submit={{this.afterSubmit}}/>`
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
    this.owner.lookup("service:caluma-options").namespace = "Foo Bar";

    // edit question
    await render(
      hbs`<CfbFormEditor::Question
        @slug='foo-bar-test-slug'
        @on-after-submit={{this.afterSubmit}}
      />`
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
      data: {
        allQuestions: { edges: [], __typename: "QuestionEdges" },
        allForms: { edges: [], __typename: "FormEdge" },
        allDataSources: { edges: [], __typename: "DataSourceEdge" },
      },
    }));

    await render(hbs`<CfbFormEditor::Question @slug='test-slug'/>`);

    assert
      .dom("p")
      .hasText('t:caluma.form-builder.question.not-found:("slug":"test-slug")');
  });

  test("it suggests a slug", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfbFormEditor::Question @slug={{null}}/>`);

    await fillIn("input[name=label]", "Test Label 123");
    assert.dom("input[name=slug]").hasValue("test-label-123");
  });

  test("it prepends the slug with a namespace", async function (assert) {
    assert.expect(3);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.strictEqual(question.slug, "foo-bar-slug");
      assert.step("after-submit");
    });

    this.owner.lookup("service:caluma-options").namespace = "Foo Bar";

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
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
      assert.strictEqual(question.__typename, "TextQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");
      assert.strictEqual(question.minLength, 10);
      assert.strictEqual(question.maxLength, 20);

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
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
      assert.strictEqual(question.__typename, "TextareaQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");
      assert.strictEqual(question.minLength, 10);
      assert.strictEqual(question.maxLength, 20);

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
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
      assert.strictEqual(question.__typename, "IntegerQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");
      assert.strictEqual(question.integerMinValue, -20);
      assert.strictEqual(question.integerMaxValue, 20);

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
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
      assert.strictEqual(question.__typename, "FloatQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");
      assert.strictEqual(question.floatMinValue, -20);
      assert.strictEqual(question.floatMaxValue, 20);

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
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
      assert.strictEqual(question.__typename, "MultipleChoiceQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");
      assert.strictEqual(question.options.edges[0].node.slug, "slug-option-1");
      assert.strictEqual(question.options.edges[0].node.label, "Option 1");
      assert.true(question.meta.hideLabel);

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
    );

    await fillIn("[name=__typename]", "MultipleChoiceQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await fillIn("[name=option-1-label]", "Option 1");
    await fillIn("[name=option-1-slug]", "option-1");
    await click(`[name="meta.hideLabel"]`);

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a radio question", async function (assert) {
    assert.expect(7);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.strictEqual(question.__typename, "ChoiceQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");
      assert.strictEqual(question.options.edges[0].node.slug, "slug-option-1");
      assert.strictEqual(question.options.edges[0].node.label, "Option 1");

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
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
    this.server.create("form", { slug: "rowform" });

    this.set("afterSubmit", (question) => {
      assert.strictEqual(question.__typename, "TableQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");
      assert.strictEqual(question.rowForm.slug, "rowform");

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
    );

    await fillIn("[name=__typename]", "TableQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await click(".ember-power-select-trigger");
    await click(".ember-power-select-option");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can search for forms in table question rowform", async function (assert) {
    assert.expect(19);

    this.server.create("form", { slug: "test-form" });
    const forms = this.server.createList("form", 5);

    this.set("afterSubmit", (question) => {
      assert.strictEqual(question.rowForm.slug, forms[0].slug);
      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
    );

    await fillIn("[name=__typename]", "TableQuestion");
    await fillIn("[name=label]", "Label");

    assert
      .dom(".ember-power-select-trigger")
      .hasText("t:caluma.form-builder.question.choose:()");
    await click(".ember-power-select-trigger");
    const options = [
      ...document.querySelectorAll(".ember-power-select-option"),
    ];
    assert.strictEqual(options.length, forms.length);
    forms.forEach((form, index) => {
      assert.dom(options[index]).containsText(form.slug);
      assert.dom(options[index]).containsText(form.name);
    });

    await fillIn(".ember-power-select-search-input", forms[0].slug);
    assert.dom(".ember-power-select-option").exists({ count: 1 });
    assert.dom(".ember-power-select-option").containsText(forms[0].slug);

    await click(".ember-power-select-option");
    assert.dom(".ember-power-select-trigger").containsText(forms[0].slug);
    assert.dom(".ember-power-select-trigger").containsText(forms[0].name);

    await click("button[type=submit]");
    assert.verifySteps(["after-submit"]);
  });

  test("it can create a form question", async function (assert) {
    assert.expect(6);

    this.server.create("form", { slug: "test-form" });
    this.server.create("form", { slug: "subform" });

    this.set("afterSubmit", (question) => {
      assert.strictEqual(question.__typename, "FormQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");
      assert.strictEqual(question.subForm.slug, "subform");

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
    );

    await fillIn("[name=__typename]", "FormQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");
    await click(".ember-power-select-trigger");
    await click(".ember-power-select-option");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can search for forms in form question subform", async function (assert) {
    assert.expect(19);

    this.server.create("form", { slug: "test-form" });
    const forms = this.server.createList("form", 5);

    this.set("afterSubmit", (question) => {
      assert.strictEqual(question.subForm.slug, forms[0].slug);
      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
    );

    await fillIn("[name=__typename]", "FormQuestion");
    await fillIn("[name=label]", "Label");

    assert
      .dom(".ember-power-select-trigger")
      .hasText("t:caluma.form-builder.question.choose:()");
    await click(".ember-power-select-trigger");
    const options = [
      ...document.querySelectorAll(".ember-power-select-option"),
    ];
    assert.strictEqual(options.length, forms.length);
    forms.forEach((form, index) => {
      assert.dom(options[index]).containsText(form.slug);
      assert.dom(options[index]).containsText(form.name);
    });

    await fillIn(".ember-power-select-search-input", forms[0].slug);
    assert.dom(".ember-power-select-option").exists({ count: 1 });
    assert.dom(".ember-power-select-option").containsText(forms[0].slug);

    await click(".ember-power-select-option");
    assert.dom(".ember-power-select-trigger").containsText(forms[0].slug);
    assert.dom(".ember-power-select-trigger").containsText(forms[0].name);

    await click("button[type=submit]");
    assert.verifySteps(["after-submit"]);
  });

  test("it can create a file question", async function (assert) {
    assert.expect(5);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.strictEqual(question.__typename, "FileQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
    );

    await fillIn("[name=__typename]", "FileQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it can create a static question", async function (assert) {
    assert.expect(5);

    this.server.create("form", { slug: "test-form" });

    this.set("afterSubmit", (question) => {
      assert.strictEqual(question.__typename, "StaticQuestion");
      assert.strictEqual(question.label, "Label");
      assert.strictEqual(question.slug, "slug");

      assert.step("after-submit");
    });

    await render(
      hbs`<CfbFormEditor::Question @form='test-form' @on-after-submit={{this.afterSubmit}}/>`
    );

    // await selectChoose("[name=__typename]", "StaticQuestion");
    await fillIn("[name=__typename]", "StaticQuestion");
    await fillIn("[name=label]", "Label");
    await fillIn("[name=slug]", "slug");

    await click("button[type=submit]");

    assert.verifySteps(["after-submit"]);
  });

  test("it validates the slug", async function (assert) {
    assert.expect(3);

    this.server.create("question", { slug: "test-slug" });
    this.server.create("question", { slug: "other-test-slug" });

    await render(hbs`<CfbFormEditor::Question @slug={{null}}/>`);

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

    await render(hbs`<CfbFormEditor::Question @slug={{null}}/>`);

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

    await render(hbs`<CfbFormEditor::Question/>`);
    await selectChoose(
      ".ember-power-select-trigger",
      ".ember-power-select-option"
    );

    assert.dom(".ember-power-select-multiple-option").exists();
  });
});
