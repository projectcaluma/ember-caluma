import { module, test } from "qunit";

import validateOptions from "@projectcaluma/ember-form-builder/validators/options";

module("Unit | Validator | options", function () {
  test("it validates correctly", async function (assert) {
    assert.expect(4);

    assert.true(await validateOptions()(null, { edges: [] }));
    assert.true(
      await validateOptions()(null, {
        edges: [{ node: { slug: "test", label: "test" } }],
      })
    );
    assert.strictEqual(
      await validateOptions()(null, {
        edges: [{ node: { slug: "test", label: "" } }],
      }),
      "Invalid options"
    );
    assert.strictEqual(
      await validateOptions()(null, {
        edges: [{ node: { slug: "", label: "test" } }],
      }),
      "Invalid options"
    );
  });
});
