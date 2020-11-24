import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | validator", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.server.create("format-validator", { slug: "email", regex: ".+" });
  });

  test("slugs are in a string not in an array", async function (assert) {
    assert.expect(1);

    const service = this.owner.lookup("service:validator");

    assert.deepEqual(await service.validate("test@test.com", ["email"]), [
      true,
    ]);
  });

  test("empty values are not being validated", async function (assert) {
    assert.expect(3);

    const service = this.owner.lookup("service:validator");

    assert.deepEqual(await service.validate(null, ["email"]), [true]);
    assert.deepEqual(await service.validate(undefined, ["email"]), [true]);
    assert.deepEqual(await service.validate("", ["email"]), [true]);
  });
});
