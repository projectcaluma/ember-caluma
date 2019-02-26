import validateOptions from "ember-caluma/validators/options";
import { module, test } from "qunit";

module("Unit | Validator | options", function() {
  test("it validates correctly", async function(assert) {
    assert.expect(4);

    assert.equal(await validateOptions()(null, { edges: [] }), true);
    assert.equal(
      await validateOptions()(null, {
        edges: [{ node: { slug: "test", label: "test" } }]
      }),
      true
    );
    assert.equal(
      await validateOptions()(null, {
        edges: [{ node: { slug: "test", label: "" } }]
      }),
      "Invalid options"
    );
    assert.equal(
      await validateOptions()(null, {
        edges: [{ node: { slug: "", label: "test" } }]
      }),
      "Invalid options"
    );
  });
});
