import { module, test } from "qunit";

import validateMeta from "@projectcaluma/ember-form-builder/validators/meta";

module("Unit | Validator | meta", function () {
  test("it validates correctly", async function (assert) {
    const validate = validateMeta();

    assert.true(validate(null, {}));
    assert.true(
      validate(null, { widgetOverride: "cf-field/input/powerselect" })
    );

    assert.strictEqual(validate(null, ""), "Meta is not a valid JSON object");
    assert.strictEqual(
      validate(null, '{ "widgetOverride": "cf-field/input/powerselect"""""}'),
      "Meta is not a valid JSON object"
    );
    assert.strictEqual(validate(null, []), "Meta is not a valid JSON object");
  });
});
