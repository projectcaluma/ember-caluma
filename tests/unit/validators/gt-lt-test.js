import { module, test } from "qunit";

import validateGtLt from "ember-caluma/validators/gt-lt";

module("Unit | Validator | gt-lt", function () {
  test("it validates correctly", function (assert) {
    assert.expect(8);

    assert.true(validateGtLt()("key", 1, null, {}, {}));
    assert.true(validateGtLt()("key", null, null, {}, {}));
    assert.true(validateGtLt({ lt: "x" })("key", 1, null, {}, { x: 2 }));
    assert.true(validateGtLt({ gt: "x" })("key", 2, null, {}, { x: 1 }));
    assert.true(validateGtLt({ lt: "x" })("key", 1, null, {}, {}));
    assert.true(validateGtLt({ gt: "x" })("key", 2, null, {}, {}));
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
