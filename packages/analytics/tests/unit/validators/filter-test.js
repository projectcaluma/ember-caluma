import { module, test } from "qunit";

import validateFilter from "@projectcaluma/ember-analytics/validators/filter";

module("Unit | Validator | filter");

test("if input is an array or undefined", function (assert) {
  const key = "filter";
  const options = {
    /* ... */
  };
  const validator = validateFilter(options);
  const errormessage = "Not an Array";

  assert.strictEqual(
    validator(key, {} /* oldvalue, changes, content */),
    errormessage
  );
  assert.strictEqual(
    validator(key, "test" /* oldvalue, changes, content */),
    errormessage
  );
  assert.strictEqual(
    validator(key, 123 /* oldvalue, changes, content */),
    errormessage
  );
  assert.ok(validator(key, undefined /* oldvalue, changes, content */));
  assert.ok(validator(key, [] /* oldvalue, changes, content */));
});
