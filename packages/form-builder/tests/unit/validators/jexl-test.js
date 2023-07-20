import { module, test } from "qunit";

import validateJexl from "@projectcaluma/ember-form-builder/validators/jexl";

module("Unit | Validator | jexl", function () {
  test("it validates correctly", async function (assert) {
    const validate = validateJexl();

    assert.true(validate(null, ""));
    assert.true(validate(null, "true"));
    assert.true(validate(null, "'test'|answer == 'foo'"));

    assert.strictEqual(
      validate(null, "'test'|foo"),
      "Transform foo is not defined",
    );
    assert.strictEqual(
      validate(null, "'test' =="),
      "Unexpected end of expression",
    );
    assert.strictEqual(
      validate(null, "'foo' = 'bar'"),
      "Invalid expression token: =",
    );
    assert.strictEqual(
      validate(null, "'a' noop 'b'"),
      "Token noop (identifier) unexpected",
    );
    assert.strictEqual(
      validate(null, "|transform"),
      "Token | (pipe) unexpected",
    );
  });
});
