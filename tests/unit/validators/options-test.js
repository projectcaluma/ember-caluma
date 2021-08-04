import { module, test } from "qunit";

import validateOptions from "ember-caluma/validators/options";

module("Unit | Validator | options", function () {
  test("it validates correctly", async function (assert) {
    assert.expect(4);

    assert.true(await validateOptions()(null, { edges: [] }));
    assert.true(
      await validateOptions()(null, {
        edges: [{ node: { slug: "test", label: "test" } }],
      })
    );
    assert.equal(
      await validateOptions()(null, {
        edges: [{ node: { slug: "test", label: "" } }],
      }),
      "Invalid options"
    );
    assert.equal(
      await validateOptions()(null, {
        edges: [{ node: { slug: "", label: "test" } }],
      }),
      "Invalid options"
    );
  });
});
