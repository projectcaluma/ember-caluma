import validateSlug from "ember-caluma-form-builder/validators/slug";
import { module, test } from "qunit";

module("Unit | Validator | slug", function() {
  test("it validates", function(assert) {
    assert.expect(1);

    assert.equal(validateSlug()("test", "test-slug-valid-123"), true);
  });

  test("it validates presence", function(assert) {
    assert.expect(2);

    assert.equal(validateSlug()("test", ""), "Test can't be blank");
    assert.equal(validateSlug()("test", null), "Test can't be blank");
  });

  test("it validates length", function(assert) {
    assert.expect(1);

    assert.equal(
      validateSlug()("test", "x".repeat(60)),
      "Test is too long (maximum is 50 characters)"
    );
  });

  test("it validates format", function(assert) {
    assert.expect(2);

    assert.equal(validateSlug()("test", "AA"), "Test is invalid");
    assert.equal(validateSlug()("test", "#"), "Test is invalid");
  });
});
