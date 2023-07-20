import Changeset from "ember-changeset";
import { module, test } from "qunit";

import validateOptions from "@projectcaluma/ember-form-builder/validators/options";

module("Unit | Validator | options", function () {
  test("it validates correctly", async function (assert) {
    assert.expect(2);

    const option = new Changeset({});

    assert.true(await validateOptions()(null, [option]));

    option.pushErrors("Test");

    assert.strictEqual(
      await validateOptions()(null, [option]),
      "Invalid options",
    );
  });
});
