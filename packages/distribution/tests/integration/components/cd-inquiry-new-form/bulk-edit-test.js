import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module(
  "Integration | Component | cd-inquiry-new-form/bulk-edit",
  function (hooks) {
    setupRenderingTest(hooks);

    // This is tested in the <CdInquiryNewForm /> component test
    test("it renders", async function (assert) {
      assert.true(true);
    });
  },
);
