import slugify from "dummy/utils/slugify";
import { module, test } from "qunit";

module("Unit | Utility | slugify", function(/*hooks*/) {
  test("it slugifies correctly", function(assert) {
    assert.equal(slugify("simple test"), "simple-test");

    assert.equal(
      slugify("TEST WITH UPPERCASE LETTERS"),
      "test-with-uppercase-letters"
    );

    assert.equal(slugify("test with numbers 123"), "test-with-numbers-123");

    assert.equal(
      slugify("test with special characters #?%/()"),
      "test-with-special-characters-percent"
    );
  });

  test("it truncates string with more than 150 characters", function(assert) {
    assert.equal(slugify("0123456789".repeat(20)).length, 127);
  });
});
