import { set } from "@ember/object";
import { render, click, scrollTo } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import data from "../../unit/lib/data";

import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

module("Integration | Component | document-validity", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.document = this.owner
      .factoryFor("caluma-model:document")
      .create({ raw: parseDocument(data) });

    this.field = this.document.fields[0];

    this.makeInvalid = () => {
      set(this.field.question, "isRequired", "true");
      set(this.field.answer, "value", "");
    };

    this.makeValid = () => {
      set(this.field.question, "isRequired", "false");
    };
  });

  test("it checks validity", async function (assert) {
    assert.expect(1);

    await render(hbs`
      <DocumentValidity @document={{this.document}} @validateOnEnter={{true}} as |isValid|>
        <p>
          {{#if isValid}}
            Valid
          {{else}}
            Invalid
          {{/if}}
        </p>
      </DocumentValidity>
    `);

    await scrollTo("p", 0, 0);

    assert.dom("p").hasText("Valid");
  });

  test("it can be triggered manually", async function (assert) {
    assert.expect(3);

    this.makeInvalid();

    await render(hbs`
      <DocumentValidity @document={{this.document}} as |isValid validate|>
        <p>
          {{#if isValid}}
            Valid
          {{else}}
            Invalid
          {{/if}}
        </p>
        <button {{on "click" validate}}>Validate!</button>
      </DocumentValidity>
    `);

    assert.dom("p").hasText("Valid");
    await click("button");
    assert.dom("p").hasText("Invalid");
    this.makeValid();
    await click("button");
    assert.dom("p").hasText("Valid");
  });

  test("it triggers onValid and onInvalid callbacks", async function (assert) {
    assert.expect(4);

    this.onInvalid = () => assert.step("invalid");
    this.onValid = () => assert.step("valid");

    await render(hbs`
      <DocumentValidity
        @document={{this.document}}
        @onValid={{this.onValid}}
        @onInvalid={{this.onInvalid}}
        as |isValid validate|
      >
        <button {{on "click" validate}}></button>
      </DocumentValidity>
    `);

    this.makeInvalid();
    await click("button");
    await assert.verifySteps(["invalid"]);

    this.makeValid();
    await click("button");
    await assert.verifySteps(["valid"]);
  });
});
