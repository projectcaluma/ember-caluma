import { module, test } from "qunit";

import validateFilter from "@projectcaluma/ember-analytics/validators/filter";

module("Unit | Validator | filter");

test("it exists", function (assert) {
  assert.ok(validateFilter());
});
