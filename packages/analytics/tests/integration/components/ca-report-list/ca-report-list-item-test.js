import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | ca-report-list/ca-report-list-item",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<CaReportList::CaReportListItem />`);

      assert.dom(this.element).hasText("");

      // Template block usage:
      await render(hbs`
      <CaReportList::CaReportListItem>
        template block text
      </CaReportList::CaReportListItem>
    `);

      assert.dom(this.element).hasText("template block text");
    });
  }
);
