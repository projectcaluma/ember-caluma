import { set } from "@ember/object";
import { render, settled, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import data from "../../unit/lib/data";

import { parseDocument } from "ember-caluma/lib/parsers";

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
      <DocumentValidity @document={{this.document}} as |isValid|>
        <p>
          {{#if isValid}}
            Valid
          {{else}}
            Invalid
          {{/if}}
        </p>
      </DocumentValidity>
    `);

    // eslint-disable-next-line
    await settled();
    assert.dom("p").hasText("Valid");
  });

  test("it can be triggered manually", async function (assert) {
    assert.expect(3);

    this.makeInvalid();

    await render(hbs`
      <DocumentValidity @document={{this.document}} @validateOnEnter={{false}} as |isValid validate|>
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
});
