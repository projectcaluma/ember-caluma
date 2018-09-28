import validateGtLt from "ember-caluma-form-builder/validators/gt-lt";
import { module, test } from "qunit";

module("Unit | Validator | gt-lt", function() {
  test("it validates correctly", function(assert) {
    assert.expect(8);

    assert.equal(validateGtLt()("key", 1, null, {}, {}), true);
    assert.equal(validateGtLt()("key", null, null, {}, {}), true);
    assert.equal(validateGtLt({ lt: "x" })("key", 1, null, {}, { x: 2 }), true);
    assert.equal(validateGtLt({ gt: "x" })("key", 2, null, {}, { x: 1 }), true);
    assert.equal(validateGtLt({ lt: "x" })("key", 1, null, {}, {}), true);
    assert.equal(validateGtLt({ gt: "x" })("key", 2, null, {}, {}), true);
    assert.equal(
      validateGtLt({ gt: "x" })("key", 1, null, {}, { x: 2 }),
      "Key must be greater than X"
    );
    assert.equal(
      validateGtLt({ lt: "x" })("key", 2, null, {}, { x: 1 }),
      "Key must be less than X"
    );
  });
});
