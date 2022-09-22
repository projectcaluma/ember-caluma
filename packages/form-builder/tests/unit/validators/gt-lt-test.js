import { module, test } from "qunit";

import validateGtLt from "@projectcaluma/ember-form-builder/validators/gt-lt";

module("Unit | Validator | gt-lt", function () {
  test("it validates correctly", function (assert) {
    assert.expect(7);

    assert.true(validateGtLt()("key", 1, null, {}, {}));
    assert.true(validateGtLt({ lt: "x" })("key", 1, null, {}, { x: 2 }));
    assert.true(validateGtLt({ gt: "x" })("key", 2, null, {}, { x: 1 }));
    assert.true(validateGtLt({ lt: "x" })("key", 1, null, {}, {}));
    assert.true(validateGtLt({ gt: "x" })("key", 2, null, {}, {}));
    assert.strictEqual(
      validateGtLt({ gt: "x" })("key", 9, null, {}, { x: 10 }),
      "Key must be greater than 10"
    );
    assert.strictEqual(
      validateGtLt({ lt: "x" })("key", 11, null, {}, { x: 10 }),
      "Key must be less than 10"
    );
  });
});
