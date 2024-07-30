import Application from "@ember/application";
import { run } from "@ember/runloop";
import Resolver from "ember-resolver";
import { module, test } from "qunit";

import { initialize } from "@projectcaluma/ember-form-builder/instance-initializers/application";
import config from "dummy/config/environment";

module("Unit | Instance Initializer | application", function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix;
      podModulePrefix = config.podModulePrefix;
      Resolver = Resolver;
    };
    this.TestApplication.instanceInitializer({
      name: "initializer under test",
      initialize,
    });
    this.application = this.TestApplication.create({ autoboot: false });
    this.instance = this.application.buildInstance();
  });
  hooks.afterEach(function () {
    run(this.instance, "destroy");
    run(this.application, "destroy");
  });

  // TODO: Replace this with your real tests.
  test("it works", async function (assert) {
    await this.instance.boot();

    assert.ok(true);
  });
});
