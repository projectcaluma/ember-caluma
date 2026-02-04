import { render, click, scrollTo, settled } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { rawDocumentWithWorkItem } from "../../unit/lib/data";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";
import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | document-validity", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.document = new (this.owner.factoryFor("caluma-model:document").class)({
      raw: parseDocument(rawDocumentWithWorkItem),
      owner: this.owner,
    });

    // Create a mirage document with two "private" attributes `__isValid` and
    // `__errors` that will be used as return value for the `documentValidity`
    // graph
    this.mirageDocument = this.server.create("document", {
      id: decodeId(rawDocumentWithWorkItem.id),
      __isValid: true,
      __errors: [],
    });

    this.field = this.document.findField("question-1");
    this.tableField = this.document.findField("table");
    this.rowField = this.tableField.value[0].findField("table-form-question");

    this.makeInvalid = async () => {
      this.field.answer.value = "";
      await settled();
    };

    this.makeValid = async () => {
      this.field.answer.value = "Test";
      await settled();
    };
  });

  test("it checks validity", async function (assert) {
    assert.expect(1);

    await render(hbs`<DocumentValidity
  @document={{this.document}}
  @validateOnEnter={{true}}
  as |isValid|
>
  <p>
    {{#if isValid}}
      Valid
    {{else}}
      Invalid
    {{/if}}
  </p>
</DocumentValidity>`);

    await scrollTo("p", 0, 0);

    assert.dom("p").hasText("Valid");
  });

  test("it can be triggered manually", async function (assert) {
    assert.expect(3);

    await this.makeInvalid();

    await render(hbs`<DocumentValidity @document={{this.document}} as |isValid validate|>
  <p>
    {{#if isValid}}
      Valid
    {{else}}
      Invalid
    {{/if}}
  </p>
  <button type="button" {{on "click" validate}}>Validate!</button>
</DocumentValidity>`);

    assert.dom("p").hasText("Valid");
    await click("button");
    assert.dom("p").hasText("Invalid");
    await this.makeValid();
    await click("button");
    assert.dom("p").hasText("Valid");
  });

  test("it triggers onValid and onInvalid callbacks", async function (assert) {
    assert.expect(4);

    this.onInvalid = () => assert.step("invalid");
    this.onValid = () => assert.step("valid");

    await render(hbs`<DocumentValidity
  @document={{this.document}}
  @onValid={{this.onValid}}
  @onInvalid={{this.onInvalid}}
  as |isValid validate|
>
  <button type="button" {{on "click" validate}}></button>
</DocumentValidity>`);

    await this.makeInvalid();
    await click("button");
    await assert.verifySteps(["invalid"]);

    await this.makeValid();
    await click("button");
    await assert.verifySteps(["valid"]);
  });

  test("it can be triggered manually", async function (assert) {
    this.mirageDocument.update({
      __isValid: false,
      __errors: [
        {
          slug: this.field.question.slug,
          errorMsg: "Error 1!",
          errorCode: "format_validation_failed",
          documentId: this.field.document.uuid,
        },
        {
          slug: this.rowField.question.slug,
          errorMsg: "Error 2!",
          errorCode: "format_validation_failed",
          documentId: this.rowField.document.uuid,
        },
      ],
    });

    await render(hbs`<DocumentValidity @document={{this.document}} as |isValid validate|>
  <p>
    {{#if isValid}}
      Valid
    {{else}}
      Invalid
    {{/if}}
  </p>
  <button type="button" {{on "click" validate}}>Validate!</button>
</DocumentValidity>`);

    assert.dom("p").hasText("Valid");
    assert.false(this.field.isInvalid);
    assert.false(this.rowField.isInvalid);
    assert.false(this.tableField.isInvalid);

    await click("button");

    assert.dom("p").hasText("Invalid");
    assert.true(this.field.isInvalid);
    assert.true(this.rowField.isInvalid);
    assert.true(this.tableField.isInvalid);
  });
});
