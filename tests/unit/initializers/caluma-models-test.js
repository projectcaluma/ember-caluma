import Application from "@ember/application";

import { initialize } from "dummy/initializers/caluma-models";
import { module, test } from "qunit";
import { run } from "@ember/runloop";

module("Unit | Initializer | caluma-models", function(hooks) {
  hooks.beforeEach(function() {
    this.TestApplication = Application.extend();
    this.TestApplication.initializer({
      name: "initializer under test",
      initialize
    });

    this.application = this.TestApplication.create({ autoboot: false });
  });

  hooks.afterEach(function() {
    run(this.application, "destroy");
  });

  test("it registers the caluma models", async function(assert) {
    await this.application.boot();

    assert.ok(this.application.hasRegistration("caluma-model:document"));
    assert.ok(this.application.hasRegistration("caluma-model:question"));
    assert.ok(this.application.hasRegistration("caluma-model:form"));
    assert.ok(this.application.hasRegistration("caluma-model:fieldset"));
    assert.ok(this.application.hasRegistration("caluma-model:answer"));
    assert.ok(this.application.hasRegistration("caluma-model:field"));
    assert.ok(this.application.hasRegistration("caluma-model:navigation"));
    assert.ok(this.application.hasRegistration("caluma-model:navigation-item"));
  });
});
