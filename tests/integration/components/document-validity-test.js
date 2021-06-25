import { render, settled } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import data from "../../unit/lib/data";

module("Integration | Component | document-validity", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it checks validity", async function (assert) {
    this.set("document", data);

    await settled();

    await render(hbs`
      <DocumentValidity @document={{this.document}} as |isValid|>
        {{#if (not isValid)}}
          Not valid document
        {{/if}}
      </DocumentValidity>
    `);

    assert.equal(this.element.textContent.trim(), "Not valid document");
  });
});
