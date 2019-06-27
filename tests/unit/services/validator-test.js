import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import { settled } from "@ember/test-helpers";

module("Unit | Service | validator", function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.server.create("format-validator", { slug: "email", regex: ".+" });
  });

  test("it exists", function(assert) {
    assert.expect(1);
    let service = this.owner.lookup("service:validator");
    assert.ok(service);
  });

  test("slugs are in a string not in an array", async function(assert) {
    assert.expect(1);
    this.server.logging = true;
    let service = this.owner.lookup("service:validator");
    await settled();
    let result = service.validate("test@test.com", "email");
    assert.deepEqual(result, [true]);
  });
});
