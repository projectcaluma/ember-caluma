import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module(
  "Integration | Component | ca-field-selector-list/ca-field-function-select",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks, ["en"]);
    setupMirage(hooks);

    test("it renders", async function (assert) {
      this.set("update", () => {
        assert.step("update");
      });

      this.set("field", {
        dataSource: "some.path.to.field",
      });

      await render(
        hbs`<CaFieldSelectorList::CaFieldFunctionSelect @update={{this.update}} @field={{this.field}} @tableSlug={{"test"}} />`
      );

      const requests = this.server.pretender.handledRequests;
      assert.equal(requests.length, 1);
      assert.dom(".ember-power-select-trigger").exists({ count: 1 });
      assert.ok(requests[0].sendArguments[0].includes("AllAnalyticsFields"));
    });
  }
);
